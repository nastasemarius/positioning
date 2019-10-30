import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';

declare var H: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass']
})
export class MapComponent implements OnInit, AfterViewInit {

  @ViewChild('map', { static: true }) public mapElement: ElementRef;

  public lat: any = '59.334591';
  public lng: any = '18.063240';
  public address: string;

  public width: any = '1980px';
  public height: any = '800px';

  private platform: any;
  private map: any;

  // tslint:disable-next-line: variable-name
  private _appId = '8S8MHH4Rm3RJIcF5trV3';
  // tslint:disable-next-line: variable-name
  private _appCode = 'xME_AZTQC5BY5ysTtyX7Hg';

  public query: string;
  private search: any;
  private ui: any;

  public constructor() {
    this.query = '';
  }

  public ngOnInit() {
    this.platform = new H.service.Platform({
      app_id: this._appId,
      app_code: this._appCode,
      useHTTPS: true
    });
    this.search = new H.places.Search(this.platform.getPlacesService());
  }

  public ngAfterViewInit() {
    const pixelRatio = window.devicePixelRatio || 1;
    const defaultLayers = this.platform.createDefaultLayers({
      tileSize: pixelRatio === 1 ? 256 : 512,
      ppi: pixelRatio === 1 ? undefined : 320
    });

    this.map = new H.Map(this.mapElement.nativeElement,
      defaultLayers.normal.map, { pixelRatio });

    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
    const ui = H.ui.UI.createDefault(this.map, defaultLayers);

    this.map.setCenter({ lat: this.lat, lng: this.lng });
    this.map.setZoom(4);
  }

  public places(query: string) {
    this.map.removeObjects(this.map.getObjects());
    this.search.request({ q: query, at: this.lat + ',' + this.lng }, {}, (data: { results: { items: { position: any[]; }[]; }; }) => {
      for (let i = 0; i < data.results.items.length; i++) {
        this.dropMarker({ lat: data.results.items[i].position[0], lng: data.results.items[i].position[1] }, data.results.items[i]);
        if (i === 0) {
          this.map.setCenter({ lat: data.results.items[i].position[0], lng: data.results.items[i].position[1] });
        }
      }
    }, (error: any) => {
      console.error(error);
    });
  }

  private dropMarker(coordinates: any, data: any) {
    const marker = new H.map.Marker(coordinates);
    marker.setData('<p>' + data.title + '<br>' + data.vicinity + '</p>');
    marker.addEventListener('tap', (event: { target: { getPosition: () => void; getData: () => void; }; }) => {
      const bubble = new H.ui.InfoBubble(event.target.getPosition(), {
        content: event.target.getData()
      });
      this.ui.addBubble(bubble);
    }, false);
    this.map.addObject(marker);
  }

  public setUpClickListener(map: any) {
    const self = this;
    this.map.addEventListener('tap', (evt) => {
      const coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
      self.lat = Math.abs(coord.lat.toFixed(4)) + ((coord.lat > 0) ? 'N' : 'S');
      self.lng = Math.abs(coord.lng.toFixed(4)) + ((coord.lng > 0) ? 'E' : 'W');
      self.fetchAddress(coord.lat, coord.lng);
    });
  }

  private fetchAddress(lat: any, lng: any): void {
    const self = this;
    // tslint:disable-next-line: one-variable-per-declaration
    const geocoder: any = this.platform.getGeocodingService(),
      parameters = {
        prox: lat + ', ' + lng + ',20',
        mode: 'retrieveAreas',
        gen: '9'
      };


    geocoder.reverseGeocode(parameters,
      (result) => {
        const data = result.Response.View[0].Result[0].Location.Address;
        self.address = data.Label + ', ' + data.City + ', Pin - ' + data.PostalCode + ' ' + data.Country;
      }, (error) => {
        alert(error);
      });
  }
}
