#define PI 3.14159265359

uniform sampler2D t_diffuse;
uniform float u_alpha;
uniform float u_progress;

varying vec2 vUv;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),sin(_angle),cos(_angle));
}

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,0.0,_scale.y);
}

float box(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - _size*0.5;
    vec2 uv = smoothstep(_size,
                        _size+vec2(0.001),
                        _st);
    uv *= smoothstep(_size,
                    _size+vec2(0.001),
                    vec2(1.0)-_st);
    return uv.x*uv.y;
}

void main() {

    vec4 texture = texture2D(t_diffuse, vUv);

    vec3 color = texture.rgb;

    vec2 st1 = vUv;
    st1 -= vec2(0.5);
    st1 = scale(vec2( 1. - u_progress * 0.5, 1. )) * rotate2d( 2. * PI * 0.14  ) * st1;
    st1 += vec2(0.4, 0.37);

    vec2 st2 = vUv;
    st2 -= vec2(0.5);
    st2 = scale(vec2( 1. - u_progress * 0.5, 1. )) * rotate2d( 2. * PI * 0.14  ) * st2;
    st2 += vec2(0.6, 0.63);

    vec3 color1 = vec3(box(st1, vec2(0.7, 0.2)));
    vec3 color2 = vec3(box(st2, vec2(0.7, 0.2)));

    vec3 maskColor = color1 + color2;

    float alpha = texture.a * u_alpha * maskColor.r;

    //gl_FragColor = vec4(maskColor, 1.);
    gl_FragColor = vec4(color, alpha);
}
