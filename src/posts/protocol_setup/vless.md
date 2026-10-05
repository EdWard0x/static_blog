---
title: Xray VLESS-Vision-REALITY
date: 2026-10-05 # 发布日期
description: "自建协议"
tags: [Vless] # 标签列表，自动生成分类索引
categories: [vps]
draft: false # 是否为草稿（设为 true 则只在本地显示，不会发布到线上）
---

## 一、Xray 安装

### 1.1 准备环境

在开始之前，确保你的 VPS 已经安装了 curl。如果提示命令不存在，请先安装：

```bash
apt update && apt install -y curl  # Debian/Ubuntu 无脑推荐Debian就是的了
yum install -y curl              # CentOS
```

### 1.2 执行一键安装脚本

使用 Xray 官方提供的安装脚本，它可以自动完成二进制文件的下载及 Systemd 服务的配置：

```bash
bash -c "$(curl -L https://github.com/XTLS/Xray-install/raw/main/install-release.sh)" @ install

wget https://github.com/XTLS/Xray-install/raw/main/install-release.sh # 将安装脚本下载至本地
sudo bash install-release.sh # 执行安装命令
rm ~/install-release.sh # 使用完成之后可以删除该脚本
```

- 项目地址：[XTLS/Xray-core](https://github.com/XTLS/Xray-core)
- 配置文件路径：/usr/local/etc/xray/config.json

如果你的小鸡内存在 256MB 及以下，无法完整运行安装脚本的话，可以考虑以下方式安装：

```bash
# 创建临时目录
mkdir -p ~/xray_temp && cd ~/xray_temp

# 下载最新版（推荐方式，自动跳转最新 release）
wget https://github.com/XTLS/Xray-core/releases/latest/download/Xray-linux-64.zip

# 或者指定版本（例如 v26.5.9）
# wget https://github.com/XTLS/Xray-core/releases/download/v26.5.9/Xray-linux-64.zip

# 安装 unzip（如果没有）
sudo apt update && sudo apt install -y unzip

# 解压
unzip Xray-linux-64.zip

# 把主程序放到系统路径，并赋予执行权限
sudo install -m 755 xray /usr/local/bin/xray

# 可选：同时安装 geo 文件
sudo install -m 644 geoip.dat /usr/local/share/xray/
sudo install -m 644 geosite.dat /usr/local/share/xray/

# 创建配置文件目录
sudo mkdir -p /usr/local/etc/xray

# 创建示例配置文件（后续自己修改）
sudo tee /usr/local/etc/xray/config.json > /dev/null <<EOF
{
  "inbounds": [],
  "outbounds": [
    {
      "protocol": "freedom",
      "tag": "direct"
    }
  ]
}
EOF

# 创建 systemd 服务文件
sudo tee /etc/systemd/system/xray.service > /dev/null <<EOF
[Unit]
Description=Xray Service
Documentation=https://github.com/XTLS/Xray-core
After=network.target nss-lookup.target

[Service]
User=nobody
CapabilityBoundingSet=CAP_NET_ADMIN CAP_NET_BIND_SERVICE
AmbientCapabilities=CAP_NET_ADMIN CAP_NET_BIND_SERVICE
NoNewPrivileges=true
ExecStart=/usr/local/bin/xray run -c /usr/local/etc/xray/config.json
Restart=on-failure
RestartPreventExitStatus=23
LimitNPROC=10000
LimitNOFILE=1000000

[Install]
WantedBy=multi-user.target
EOF

# 重新加载 systemd
sudo systemctl daemon-reload

# 启用并启动服务
sudo systemctl enable --now xray

# 查看状态
sudo systemctl status xray

# 查看实时日志
journalctl -u xray -f

# 常用管理命令
sudo systemctl start xray      # 启动
sudo systemctl stop xray       # 停止
sudo systemctl restart xray    # 重启
sudo systemctl status xray     # 状态
xray version                   # 版本号
```

---

## 二、 配置

### 2.1 准备密钥与 UUID

在填写配置前，我们需要生成节点身份证明：

```bash
xray uuid     # 生成用户 ID
xray x25519  # 生成 REALITY 密钥对
```

> **注意**：运行 `x25519` 后会得到 `Private key` 和 `Public key`（即输出中的 Password）。**私钥**填在服务端，**公钥**填在客户端。

### 2.2 编写服务端配置文件

推荐使用 [chika0801/Xray-examples](https://github.com/chika0801/Xray-examples) 中的 [VLESS-Vision-REALITY 模版](https://github.com/chika0801/Xray-examples/blob/main/VLESS-Vision-REALITY/config_server.json)。

使用 `nano /usr/local/etc/xray/config.json` 打开文件并粘贴配置。

```bash
apt update && apt install -y nano    # 安装nano（若没有）
nano /usr/local/etc/xray/config.json # 编辑xray配置文件
```

配置文件示例——

```json
{
  "log": {
    "loglevel": "warning"
  },
  "inbounds": [
    {
      "listen": "0.0.0.0", // ipv6这里填"::"
      "port": 443, // 可任意设置，443被占用可用其他高位端口
      "protocol": "vless",
      "settings": {
        "clients": [
          {
            "id": "chika", // 长度为 1-30 字节的任意字符串，或执行 xray uuid 生成
            "flow": "xtls-rprx-vision"
          }
        ],
        "decryption": "none"
      },
      "streamSettings": {
        "network": "raw",
        "security": "reality",
        "realitySettings": {
          "target": "www.lovelive-anime.jp:443", // 目标网站最低标准：国外网站，支持 TLSv1.3、X25519 与 H2，域名非跳转用（主域名可能被用于跳转到 www）
          "serverNames": [
            // 客户端可用的 serverName 列表，暂不支持 * 通配符，在 Chrome 里输入 "dest" 的网址 -> F12 -> 安全 -> F5 -> 主要来源（安全），填证书中 SAN 的值
            "www.lovelive-anime.jp",
            "lovelive-anime.jp"
          ],
          "privateKey": "2KZ4uouMKgI8nR-LDJNP1_MHisCJOmKGj9jUjZLncVU", // 执行 xray x25519 生成，填 "Private key" 的值
          "shortIds": [
            // 客户端可用的 shortId 列表，可用于区分不同的客户端，0 到 f，长度为 2 的倍数，长度上限为 16，可留空，或执行 openssl rand -hex 1到8 生成
            "6ba85179e30d4fc2",
            "b9"
          ]
        }
      },
      "sniffing": {
        "enabled": true,
        "destOverride": ["http", "tls", "quic"]
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "tag": "direct"
    },
    {
      "protocol": "blackhole",
      "tag": "block"
    }
  ]
}
```

### 2.3 进阶：如何优雅地“偷”证书

为了提高隐蔽性，我们需要寻找优选的 `dest` 域名。相比于常用的微软或苹果，我们可以找同网段的冷门域名：

1.  打开 [bgp.tools](https://bgp.tools/)。
2.  输入你的 **VPS IP** 并回车。
3.  点击 **DNS** 选项卡，选择 **Show Forward DNS**。
4.  在列表中挑选几个同网段域名，点击进入网站。
5.  **关键步骤**：按 `F12` 打开开发者工具，检查证书是否支持 **TLS 1.3** 以及 **X25519** 算法。

> **好处**：同网段域名物理距离近（延迟常在 1ms 内），“偷”证书的速度飞快，隐蔽性极强。

### 2.4 启动与验证

保存并退出编辑（`Ctrl+K` -> `鼠标右键` -> `Ctrl+O` -> `Enter` -> `Ctrl+X`）后，执行：

```bash
# 重启服务
systemctl restart xray

# 检查运行状态
systemctl status xray
```

如果看到绿色的 **active (running)**，说明服务端大功告成！

---

## 三、 优化与其他

### 3.1 防火墙放行 443 端口

确保你的系统和云服务商后台都放行了 TCP 443 端口。若使用 `ufw`：

```bash
ufw allow 443/tcp
ufw allow 22/tcp  # 千万别忘了放行 SSH，否则会失联！
ufw enable
```

### 3.2 安装 BBR 加速

开启内核级的 BBR 加速可以显著提升跨国链路的稳定性和速度：

```bash
# 添加参数配置文件并指定开启 BBR
sudo nano /etc/sysctl.d/99-bbr.conf

# 把下面的内容添加进去
net.core.default_qdisc=fq
net.ipv4.tcp_congestion_control=bbr

# 读取配置，使 BBR 设置生效
sudo sysctl --system

# 确认BBR开启，此时应该返回这样的结果：net.ipv4.tcp_congestion_control = bbr
sysctl net.ipv4.tcp_congestion_control

# 如果你想确认 fq 算法是否正确开启，可以使用下面的命令，此时应该返回这样的结果：net.core.default_qdisc = fq
sysctl net.core.default_qdisc
```

如果你在疑惑这个 ipv4，无需在意，只是历史命名遗留，实际上对 ipv6 也是生效的。

### 3.3 客户端接头 (Clash Meta 示例)

在 Clash Meta (Mihomo) 内核中，你的节点配置应如下所示：

```yaml
proxies:
  - name: "节点1"
    type: vless
    server: 2.2.8.8 # ipv6形如"2a13:edc0:24:24f::1"，记得加引号
    port: 443
    uuid: chika # 与服务端一致
    udp: true
    tls: true
    flow: xtls-rprx-vision
    servername: www.icloud.com # 需与服务端 dest 一致
    network: tcp
    reality-opts:
      public-key: Z84J2IelR9ch3k8Vt-Vhhs5ycBUlXA7wHBWcBrjqnAw # 这里的 Public key 就是生成的第二个 Password
      short-id: 6ba85179e30d4fc2 # 与服务端一致
    client-fingerprint: chrome
```

若是 ipv6，将`2.2.8.8:443`替换为`[2a13:edc0:24:24f::1]:443`，用\[\]包裹。

```plaintext
vless://chika@2.2.8.8:443?encryption=none&flow=xtls-rprx-vision&security=reality&sni=www.icloud.com&fp=chrome&pbk=Z84J2IelR9ch3k8Vt-Vhhs5ycBUlXA7wHBWcBrjqnAw&sid=6ba85179e30d4fc2&type=tcp#节点1
```

若自己组 providers，推荐将 vless 订阅转化为`BASE64`编码，可使用以下网址[在线加密解密](https://tool.oschina.net/encrypt?type=3&hl=zh-CN)。

```plaintext
dmxlc3M6Ly9jaGlrYUAyLjIuOC44OjQ0Mz9lbmNyeXB0aW9uPW5vbmUmZmxvdz14dGxzLXJwcngtdmlzaW9uJnNlY3VyaXR5PXJlYWxpdHkmc25pPXd3dy5pY2xvdWQuY29tJmZwPWNocm9tZSZwYms9Wjg0SjJJZWxSOWNoM2s4VnQtVmhoczV5Y0JVbFhBN3dIQldjQnJqcW5BdyZzaWQ9NmJhODUxNzllMzBkNGZjMiZ0eXBlPXRjcCPoioLngrkx
```

### 3.4 小技巧与避坑指南

- **Public Key**：再次强调，客户端填写的 `public-key` 是服务端执行 `x25519` 命令后生成的第二个值（Password）。
- **移动端 IPv6**：如果你是移动网络用户，建议在 `server` 处填写 VPS 的 **IPv6 地址**。在 YAML 配置中，IPv6 地址记得一定要加上**双引号**，例如：`server: "2a13:edc0:24:24f::1"`。
- **时间同步**：VLESS 协议对时间敏感，如果连接失败，请检查 VPS 时间与本地时间误差是否在 90 秒内。

---

另附上[官方文档](https://xtls.github.io/document/)。

此文章内容转载于[ffani](https://ffani.com/post/xray-vless-vision-reality-tutorial-2026/#22-%E7%BC%96%E5%86%99%E6%9C%8D%E5%8A%A1%E7%AB%AF%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)，写的非常好，故借鉴

---
