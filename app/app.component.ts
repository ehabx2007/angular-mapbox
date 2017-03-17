import { Component, AfterViewInit } from '@angular/core';

@Component({
    selector: 'mapbox-app',
    templateUrl: 'app/app.component.html'
})
export class AppComponent implements AfterViewInit{
    mapLoaded: boolean = false;
    mapboxgl: any = window['mapboxgl'];
    appMap: any;
    _self: any;


    ngAfterViewInit() {
        this.loadMap();
    }

    loadMap() {
        if (!this.mapLoaded) {
            this.mapLoaded = true;
            
            this.mapboxgl.accessToken = 'pk.eyJ1IjoiZWhhYngyMDA3IiwiYSI6ImNpenl0NnQ3ajAzODYzM25ob3lmYXpyZmYifQ.bFssinjEACSyVbHwe5fkVg';
            this.appMap = new this.mapboxgl.Map({
                container: 'appMap', // container id
                style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
                center: [150.68,-33.81], // starting position
                zoom: 9 // starting zoom
            });
            this._self = this;

            this.appMap.on('load', (event) => {
                this.getUserPosition();
            });
            
        }
        
    }

    getUserPosition() {
        navigator.geolocation.getCurrentPosition( (position) => {

            let pointFeature = this.getPointFeature(position.coords.longitude, position.coords.latitude);
            let geojson = this.getLayerDataSource([pointFeature]);
            let collection = this.getFeaturesCollection(geojson);
            let layer = this.getFeatureLayer(collection);
            this.appMap.addLayer(layer);
            this.flyToUserPosition([position.coords.longitude, position.coords.latitude]);
            
        }, 
		(error) => {
			
			console.log(error);
			
		});
    }


    

    flyToUserPosition(position) {
        this.appMap.flyTo({
            center: position,
            zoom: 11,
            speed: 0.2,
            curve: 3
        });
    }

    getLayerDataSource(featuresArray) {
        return {
            type: "FeatureCollection",
            features: featuresArray
        }
    }

    getPointFeature(x,y) {

        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [x, y]
            },
            properties: {
                icon: {
                    className: 'my-icon icon-sf', 
                    html: '&#9749;', 
                    iconSize: null 
                }
            }
        }
    }


    getFeaturesCollection(features) {
        return {
            type: 'geojson',
            data: features
        }
    }

    getFeatureLayer(featuresCollection) {
        return {
            id: 'points',
            type: 'symbol',
            source: featuresCollection,
            layout: {
                "icon-image": "fire-station-15"
            }
        }
    }
}