# Recut Remotion Studio - 项目工程 Makefile（每个项目一份，位于 workspace/）
#
# [INPUT]: 依赖 RECUT_APP_FILES_DIR、Corepack pnpm 与 remotion-skeleton/package.json 的预览/渲染依赖
# [OUTPUT]: 对外提供 install/start/restart/stop/status/clean 任务，启动 Vite 预览并维护 serve/status.json
# [POS]: remotion-skeleton 的项目工作区命令边界；seed 只链接 node_modules，真正依赖安装与自检在这里完成
# [PROTOCOL]: 变更时更新此头部，然后检查 README.md

SHELL := /bin/sh
NODE ?= node
PNPM := corepack pnpm@8.15.0
FILES := $(RECUT_APP_FILES_DIR)
NM := node_modules
STATUS := $(FILES)/serve/status.json
# node_modules 是符号链接，指向 App 的 render 工作区依赖；pnpm store 位于 App 包外部，升级 App 不会丢缓存。
APP_RENDER := $(patsubst %/,%,$(dir $(shell readlink $(NM) 2>/dev/null)))

.PHONY: install start restart stop status clean

install:
	@test -n "$(FILES)" || { echo "错误: 缺少 RECUT_APP_FILES_DIR（应由 Recut 宿主注入）"; exit 1; }
	@test -L $(NM) -o -d $(NM) || { echo "错误: node_modules 缺失，请先运行 workspace.ensure 完成 seed"; exit 1; }
	@test -f index.html && test -f vite.config.ts && test -d src || { echo "错误: 骨架工程不完整，请重新 workspace.ensure"; exit 1; }
	@$(NODE) node-check.js >/dev/null 2>&1 || { \
		echo "[preview-bootstrap] 安装 App 渲染工作区依赖（优先离线复用 pnpm store）…"; \
		$(PNPM) --dir "$(APP_RENDER)" install --frozen-lockfile --offline || $(PNPM) --dir "$(APP_RENDER)" install --frozen-lockfile --prefer-offline || { echo "错误: pnpm 依赖安装失败，请检查网络、Corepack 或 pnpm store 后重试"; exit 1; }; \
		echo "[preview-bootstrap] 依赖已就绪。"; \
	}
	@$(NODE) node-check.js >/dev/null 2>&1 || { echo "错误: 预览依赖仍缺失，请重新安装 App 渲染工作区依赖"; exit 1; }
	@echo "install: ok"

start: install
	@echo "start: 启动预览 dev server（端口冲突会由 vite-server.js 自动换空闲端口）"
	@node vite-server.js

restart: stop start

stop:
	@node -e "const fs=require('fs');const p=process.env.RECUT_APP_FILES_DIR+'/serve/status.json';try{const s=JSON.parse(fs.readFileSync(p,'utf8'));if(s.pid){try{process.kill(s.pid,'SIGTERM')}catch(e){console.log('stop: 进程已退出',s.pid)}console.log('stop: 已发送 SIGTERM 到',s.pid)}else{console.log('stop: 无运行中的服务')}}catch(e){console.log('stop: 无状态文件（未运行）')}"

status:
	@cat $(STATUS) 2>/dev/null || echo "status: not running"

clean:
	rm -rf preview exports inputs
	@echo "clean: 已清理预览/导出/输入产物"
