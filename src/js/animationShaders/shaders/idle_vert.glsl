@import ../../../shaders/vert_base;

void main(void) {
  // scale triangles to their centroids
  // centroid × (1 − triangleScale) + position × triangleScale
  vec3 trianglePos = mix(centroid.xyz, position.xyz, triangleScale);

  gl_Position = modelViewMatrix * vec4(trianglePos, 1.0);
  gl_PointSize = pointSize;
}
