# Workspace Configuration Reference

This page documents the configuration options available for the top-level workspace configuration file, `cosim-studio.yaml`, in the CoSimulation Studio Visual Studio Code Extension.

## Configuration Structure

The top-level structure is an object with the following properties:

### maestro

The `maestro` property configures the Maestro web service. It is an object containing the following fields:

| Property    | Type   | Default     | Description                               | Constraints        |
|------------|-------|------------|-------------------------------------------|------------------|
| `host`     | string | `localhost` | The hostname or IP address of the Maestro web service. | None            |
| `port`     | number | `8082`      | The port number on which the Maestro web service is running. | Minimum: `0`, Maximum: `65535` |

### Example Configuration

```yaml
maestro:
  host: https://localhost
  port: 8082
```
