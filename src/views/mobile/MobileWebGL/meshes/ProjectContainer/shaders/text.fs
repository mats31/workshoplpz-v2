uniform sampler2D t_diffuse;
uniform float u_alpha;

varying vec2 vUv;

void main() {

  vec4 texture = texture2D(t_diffuse, vUv);

  vec3 color = texture.rgb;
  float alpha = texture.a * u_alpha;

  gl_FragColor = vec4(color, alpha);
}
