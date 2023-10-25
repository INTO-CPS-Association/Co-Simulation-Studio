# Run Maestro

The goal is to run Maestro software in the background
on Windows, Linux and Mac OS operating systems.

Desirable outcomes:

* Start and Stop Maestro
* Run multiple Maestro instances

## Development ideas

1. Use [tasks](https://code.visualstudio.com/docs/editor/tasks#vscode),
   [task config](https://code.visualstudio.com/docs/editor/tasks-appendix),
   [task provider](https://code.visualstudio.com/api/extension-guides/task-provider)
   to get most of the background work done.
1. Use [webviews](https://code.visualstudio.com/api/ux-guidelines/webviews) and
   [webview API](https://github.com/Microsoft/vscode-docs/blob/main/api/extension-guides/webview.md)
   where needed.
