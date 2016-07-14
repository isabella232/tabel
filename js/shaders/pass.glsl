#define PI 3.14159265359

precision mediump float;

uniform sampler2D data;
uniform vec2 resolution;
uniform float t;

const float LINES = 16.0;

#pragma glslify: snoise2 = require( glsl-noise/simplex/2d )
#pragma glslify: cubicIn = require( glsl-easings/quartic-in )


float calculateSection( in float y ) {
    return floor( ( 1.0 - y ) / ( 1.0 / LINES ) ) + 1.0;
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;

    float section = calculateSection( uv.y );
    float noise = snoise2( vec2( section / 10.0, 0 ) );

    // Calculate offset based on t (animate in / out)

    float prefix = sign( t );

    float percent = min( abs( t ), 1.0 );
    float eased = cubicIn( percent );
    float positiveNoise = ( noise + 1.0 ) * 0.5;

    float offset = eased + positiveNoise * eased;

    offset *= prefix;

    gl_FragColor = vec4(
        offset,
        0,
        0,
        0
    );
}
