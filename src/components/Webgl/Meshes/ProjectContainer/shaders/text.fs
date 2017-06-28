uniform sampler2D u_map;
uniform float u_alpha;

varying vec2 vUv;

void main() {

  vec4 texture = texture2D( u_map, vUv );

  vec3 color = texture.rgb;
  float alpha = texture.a * u_alpha;

  if(alpha < 0.1)
  {
      discard;
  }

  gl_FragColor = vec4(color, alpha);
  // gl_FragColor = vec4(1., 0., 0., 1.);
}
