const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// 执行命令并以 Promise 返回
function execP(command = '', cwd) {
    return new Promise((res, rej) => {
        exec(command, { cwd: cwd || __dirname }, (error, stdout, stderr) => {
            if (error) {
                rej(error);
            } else {
                res({ stdout, stderr });
            }
        });
    });
}

// 获取服务配置文件
function getServiceConfigdir(version = '', isDefault) {
    const servicesDir = path.resolve(__dirname, './services/');
    if (!fs.existsSync(servicesDir)) {
        fs.mkdirSync(servicesDir);
    }

    let configName = version;
    let appName = version;
    if (isDefault) {
        configName = 'default-config-for-wslx';
        appName = 'default';
    }

    const dirpath = path.resolve(__dirname, './services', `${configName}/`);

    if (!fs.existsSync(dirpath)) {
        // 不存在文件

        const templateArgs = {
            appId: `wslx-${configName}`,
            appName: `wslx-${appName}`,
            appDesc: `wslx startup service for ${appName}`,
            args: isDefault ? '' : `-d ${version}`,
        };

        let configStr = fs.readFileSync(path.resolve(__dirname, './bin/service-template.xml')).toString();

        Object.keys(templateArgs).forEach((key) => {
            configStr = configStr.replace(`$$${key}$$`, templateArgs[key]);
        });

        fs.mkdirSync(dirpath);
        fs.writeFileSync(path.resolve(dirpath, 'service.xml'), configStr);
        fs.copyFileSync(path.resolve(__dirname, './bin/service.exe'), path.resolve(dirpath, 'service.exe'));
    }

    return dirpath;
}

module.exports = async function (command = '', version = '') {
    const isDefault = version == '';

    if (command === 'boot') {
        await execP('wsl -- exit');
        const initCommand = 'bash init.sh';
        const args = isDefault ? ` -u root -- ${initCommand}` : ` -d ${version} -u root -- ${initCommand}`;
        // 为了让临时文件删除，先启动再进入执行
        const { stdout, stderr } = await execP(`wsl${args}`);
        console.log(stdout);
    } else if (command === 'shutdown') {
        await execP(`wsl --shutdown`);
        const { stdout, stderr } = await execP(`wsl -l -v`);

        console.log(stdout);
    } else if (command === 'startup') {
        const configDir = getServiceConfigdir(version, isDefault);

        // 注册服务
        const { stdout: installOut } = await execP(`service.exe install`, path.resolve(__dirname, './services/', configDir));
        console.log(installOut);

        // 启动服务
        const { stdout: startOut } = await execP(`service.exe start`, path.resolve(__dirname, './services/', configDir));
        console.log(startOut);
    } else if (command === 'cancelStartup') {
        const configDir = getServiceConfigdir(version, isDefault);

        // 停止服务
        const { stdout: stopOut } = await execP(`service.exe stop`, path.resolve(__dirname, './services/', configDir));
        console.log(stopOut);

        // 卸载服务
        const { stdout: uninstallOut } = await execP(`service.exe uninstall`, path.resolve(__dirname, './services/', configDir));
        console.log(uninstallOut);
    } else if (command === 'startupStatus') {
        const configDir = getServiceConfigdir(version, isDefault);

        // 查看状态
        const { stdout: statusOut } = await execP(`service.exe status`, path.resolve(__dirname, './services/', configDir));
        console.log(statusOut);
    }
};
