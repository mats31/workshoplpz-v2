varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {

  vec3 lightDirection = normalize( vec3(-1000., 2000., -1000.) - vWorldPosition );

  float alpha = 1.;

  float c = 0.35 + max( 0.0, dot( vNormal, lightDirection ) ) * 0.1;
  vec3 color = vec3(.5) * c;

  gl_FragColor = vec4(color, alpha);
}
