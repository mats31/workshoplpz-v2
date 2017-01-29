uniform sampler2D u_map;
uniform sampler2D u_maskMap;
uniform vec2 u_resolution;

varying vec2 vUV;
varying vec3 vPos;
varying vec4 vModelPos;

void main() {

  vec4 texture = texture2D(u_map, vUV);

  vec3 color = texture.rgb;
  float alpha = texture.a;
  // vec4 center = vModelPos * vec4(0.,0.,0.,1.);
  vec2 center = vec2(0., 20.);

  float distanceToCenter = distance( vPos.xy, center );
  // float mask = abs( step( distanceToCenter, 300. ) - 1. );

  // alpha *= mask;

  if( distanceToCenter > 20.)
  {
    alpha = 0.;
  }

  gl_FragColor = vec4(color, alpha);
  gl_FragColor = texture2D(u_maskMap, vUV);
  // gl_FragColor = vec4(1.,0.,0.,0.1);
}
