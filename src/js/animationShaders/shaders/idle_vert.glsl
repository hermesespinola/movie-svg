@import ../../../shaders/vert_base;
// centroid of this point's triangle
attribute vec3 centroid;
uniform float triangleScale;

#define PI 3.14159265359

void main(void) {
  // scale triangles to their centroids
  // centroid × (1 − triangleScale) + position × triangleScale
  vec3 trianglePos = mix(centroid.xyz, position.xyz, triangleScale);

  gl_Position = modelViewMatrix * vec4(trianglePos, 1.0);
  gl_PointSize = 1.0;
}
