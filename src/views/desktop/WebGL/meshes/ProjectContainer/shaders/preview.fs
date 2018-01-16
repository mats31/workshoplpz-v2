#define PI 3.14159265359

uniform sampler2D t_diffuse;
uniform float u_alpha;

varying vec2 vUv;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),sin(_angle),cos(_angle));
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
  float alpha = texture.a * u_alpha;

  vec2 st = vUv;
  st -= vec2(0.5);
  st = rotate2d( 2. * PI * 0.3  ) * st;
  st += vec2(0.5);

  color = vec3(box(st, vec2(0.4)));

  gl_FragColor = vec4(color, alpha);
  // gl_FragColor = vec4(color, alpha);
}
