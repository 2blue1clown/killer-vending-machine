uniform float uTime;
varying vec4 vCalcPos;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main()
{
    /**
     * Position
     */
     float time = min(uTime, 1.0);
    vec4 vCalPos = vec4(position*sqrt(time)*2.0 + vec3(0,-3,0)*pow(time,2.0), 1.0);
    vCalPos.y = max(vCalPos.y, 0.0);
   
    vec4 modelPosition = modelMatrix * vCalPos;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    /**
     * Size
     */
    gl_PointSize = random(vec2(position.x, position.y*position.z)) * 10.0;
}