uniform float uTime;

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
    vec4 modelPosition = modelMatrix * vec4(position*sqrt(uTime)*2.0 + vec3(0,-3,0)*pow(uTime,2.0), 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    /**
     * Size
     */
    gl_PointSize = random(vec2(position.x, position.y*position.z)) * 10.0;
}