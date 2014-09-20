/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Surface = require('famous/core/Surface');
    var Timer = require('famous/utilities/Timer');
    var Transitionable = require('famous/transitions/Transitionable');
    var SpringTransition = require('famous/transitions/SpringTransition');
    var WallTransition = require('famous/transitions/WallTransition');
    var SnapTransition = require('famous/transitions/SnapTransition');

    Transitionable.registerMethod('spring', SpringTransition);
    Transitionable.registerMethod('wall', WallTransition);
    Transitionable.registerMethod('snap', SnapTransition);


    var customCurve1 = function(t){ return 1-Math.pow(t-1,2); };
    var customCurve2 = function(t){ return Math.pow(t, 2); };
    var TweenTransition = require('famous/transitions/TweenTransition');
    TweenTransition.registerCurve('custom1', customCurve1);
    TweenTransition.registerCurve('custom2', customCurve2);


    // create the main context
    var mainContext = Engine.createContext();

    // your app here
    mainContext.setPerspective(1000);

    var r = 100;

    var circle = new Surface({
        size: [2*r, 2*r],
        properties: {
            borderRadius: '50%',
            border: '1px solid blue'
        }
    });

    var obstacle = new Surface({
        size: [10, 10],
        properties: {
            borderRadius: '50%',
            backgroundColor: 'red'
        }
    });

    var centerMod = new Modifier({
        origin: [.5, .5],
        align: [.5, .5]
    });

    var angularVelocityObstacle = 0.01;
    var initTime = Date.now();
    var theta = 0;

    Timer.every(function() {
        angularVelocityObstacle = (Math.random()+1)*5*0.01
    }, 120);

    var obstacleMod = new Modifier({
        transform: function() {
            theta = theta+angularVelocityObstacle;

            var x = Math.cos(theta)*r;
            var y = Math.sin(theta)*r;
            return Transform.translate(x, y, 0);
        }
    });

    var center = mainContext.add(centerMod);

    center.add(circle);

    center.add(obstacleMod).add(new Modifier({
        origin: [.5, .5]
    })).add(obstacle);

    var height = new Transitionable(0);

    var angularVelocityPlayer = -0.01;
    var theta2 = 1.7;

    var playerMod = new Modifier({
        transform: function() {
            theta2 = theta2 + angularVelocityPlayer;
            // theta2 = -1.7;
            var x = Math.cos(theta2)*(r+height.get());
            var y = Math.sin(theta2)*(r+height.get());

            var x2 = Math.cos(theta)*r;
            var y2 = Math.sin(theta)*r;

            if (Math.pow(x2-x, 2)+Math.pow(y2-y, 2) < 25) {
                alert('boom!');
                // console.log('boom!');
            }

            return Transform.translate(x, y, 0);
        }
    });

    var player = new Surface({
        size: [10, 10],
        properties: {
            borderRadius: '50%',
            backgroundColor: 'green'
        }        
    });

    center.add(playerMod).add(new Modifier({
        origin: [.5, .5]
    })).add(player);

    Engine.on('keypress', function(e) {
        if (e.charCode === 32) {
            console.log('set');
            height.set(40, {curve: 'custom1', duration: 400}, function() {
                height.set(0, {curve: 'custom2', duration: 400});
            });
        }
    });

    Engine.on('touchend', function(e) {
        height.set(40, {curve: 'custom1', duration: 400}, function() {
            height.set(0, {curve: 'custom2', duration: 400});
        });
    });    
});
