cmake_minimum_required(VERSION 2.8.11)

set(CMAKE_EXECUTABLE_SUFFIX ".mjs")

add_executable(FaCTPlusPlusWASM main.c)

target_link_libraries(FaCTPlusPlusWASM LINK_PUBLIC fact)

set_target_properties(FaCTPlusPlusWASM PROPERTIES LINK_FLAGS "-s EXPORT_ES6=1 -s MODULARIZE=1 -s EXPORT_NAME=FaCTPlusPlus -s LINKABLE=1 -s EXPORT_ALL=1 -s EXPORTED_RUNTIME_METHODS=\"['ccall','cwrap','UTF8ToString']\""
                                          OUTPUT_NAME "FaCTPlusPlus")

install(TARGETS FaCTPlusPlusWASM DESTINATION ${CMAKE_INSTALL_PREFIX})
install(FILES "${CMAKE_CURRENT_BINARY_DIR}/FaCTPlusPlus.wasm" "${CMAKE_CURRENT_SOURCE_DIR}/package.json" DESTINATION ${CMAKE_INSTALL_PREFIX})