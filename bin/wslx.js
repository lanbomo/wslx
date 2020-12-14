#! /usr/bin/env node

const fs = require('fs');
const path = require('path');

const commander = require('commander');

const wslx = require('../index');

const pkgJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json')).toString());
const version = pkgJson.version;

const { Command } = commander;
const program = new Command();
program.version(version);

const desc = `a tool to strengthen function of wsl. wsl 功能增强工具.
current version is ${version}
by lanbo

Usage:
1. start default distribution version:
wslx

2. start specified distribution version:
wslx -d Ubuntu-20.04

3. set wsl start the default distribution version with windows startup:
wslx --startup

4. set wsl start the specified distribution version with windows startup:
wslx --startup Ubuntu-20.04

5. cancel wsl start the default distribution version with windows startup:
wslx --cancel-startup

6. cancel wsl start the specified distribution version with windows startup:
wslx --cancel-startup Ubuntu-20.04

7. get the status of the default distribution startup services:
wslx --startup-status

8. get the status of the specified distribution startup services:
wslx --startup-status Ubuntu-20.04

9. shutdown all running wsl
wslx -s`;

program
    .description(desc)
    .option('-d [bootVersion]', 'start specified distribution version')
    .option('--startup [startupVersion]', 'set wsl start the specified distribution version with windows startup')
    .option('--cancel-startup [cancelStartupVersion]', 'cancel wsl start the specified distribution version with windows startup')
    .option('--startup-status', 'get the status of the startup services')
    .option('-s', 'shutdown all running wsl processes')
    .action((opts) => {
        if (opts.s === true) {
            // 关闭所有正在运行的 wsl
            wslx('shutdown');
        } else if (opts.startupStatus === true) {
            // 查看默认分发版服务状态
            wslx('startupStatus');
        } else if (opts.startupStatus) {
            // 查看指定分发版服务状态
            wslx('startupStatus', opts.startupStatus);
        } else if (opts.startup === true) {
            // 设置默认分发版注册服务
            wslx('startup');
        } else if (opts.startup) {
            // 设置指定分发版注册服务
            wslx('startup', opts.startup);
        } else if (opts.cancelStartup === true) {
            // 设置默认分发版移除服务
            wslx('cancelStartup');
        } else if (opts.cancelStartup) {
            // 设置指定分发版移除服务
            wslx('cancelStartup', opts.cancelStartup);
        } else if (opts.d && opts.d !== true) {
            // 启动指定分发版
            wslx('boot', opts.d);
        } else {
            // 启动默认分发版
            wslx('boot');
        }
    });

program.parse(process.argv);
