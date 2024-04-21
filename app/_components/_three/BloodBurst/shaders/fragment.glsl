uniform float uTime;
varying vec4 vCalcPos;

void main(){  
    float cutoff = 1.0;
    float time = step(cutoff,uTime)* uTime - cutoff;
                gl_FragColor = vec4(1.0,0.0, 0.0, 1.0-time);
            }