# wslx

a tool to strengthen function of wsl. wsl 功能增强工具.

by lanbo

# Install

```shell
npm install wslx -g
```

# Usage

1. start default distribution version:
    ```
    wslx
    ```

2. start specified distribution version:
   ```
   wslx -d Ubuntu-20.04
   ```

3. set wsl start the default distribution version with windows startup:
   ```
   wslx --startup
   ```

4. set wsl start the specified distribution version with windows startup:
   ```
   wslx --startup Ubuntu-20.04
   ```

5. cancel wsl start the default distribution version with windows startup:
   ```
   wslx --cancel-startup
   ```

6. cancel wsl start the specified distribution version with windows startup:
   ```
   wslx --cancel-startup Ubuntu-20.04
   ```

7. get the status of the default distribution startup services:
   ```
   wslx --startup-status
   ```

8. get the status of the specified distribution startup services:
   ```
   wslx --startup-status Ubuntu-20.04
   ```

9. shutdown all running wsl
   ```
   wslx -s
   ```
