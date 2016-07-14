precision mediump float;

uniform sampler2D backgroundMap;
uniform sampler2D displacementMap;
uniform vec2 resolution;
uniform vec3 mouse;
uniform vec2 mouseDirection;

varying vec2 vUV;

const vec2 realSize = vec2( 1024, 640 );
const vec4 cover = vec4( 251.0 / 255.0, 249.0 / 255.0, 244.0 / 255.0, 1.0 );

vec4 getScaledImagePixel( in float offset ) {

    float scale = max( resolution.x / realSize.x, resolution.y / realSize.y );
    vec2 scaledSize = realSize * scale;
    vec2 overage = scaledSize - resolution;
    vec2 overageRelative = overage / scaledSize;
    vec2 usageRelative = vec2( 1 ) - overageRelative;
    vec2 percent = overageRelative / 2.0 + vUV * usageRelative;

    // The magic number is because the image isn't square so it only uses a percentage
    // of the entire texture. 62.5% to be exact.
    percent.y *= 0.625;

    percent.x += offset;

    float overflow = step( 1.0, percent.x ) + ( 1.0 - step( 0.0, percent.x ) );

    return mix( texture2D( backgroundMap, percent ), cover, overflow );
}

float lense( float t ) {
    return - t * ( t - 2.0 );
}

void main() {

    float offset = texture2D( displacementMap, vUV ).x;

    gl_FragColor = getScaledImagePixel( offset );
}
