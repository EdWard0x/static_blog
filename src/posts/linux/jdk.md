---
title: openjdk环境脚本
date: 2026-10-05        # 发布日期
description: 'Linux x86_64一键配置openjdk环境'
tags: [openjdk]     # 标签列表，自动生成分类索引
categories: [Linux]
draft: false                 # 是否为草稿（设为 true 则只在本地显示，不会发布到线上）
---

```bash
#!/bin/bash
JDK_URL="https://download.java.net/java/GA/jdk21.0.3/28f18dd3f38a4c19b3a6e6d5a6e5a1e3/8/GPL/openjdk-21.0.3_linux-x64_bin.tar.gz"
wget $JDK_URL -O /tmp/jdk.tar.gz
sudo tar -xzf /tmp/jdk.tar.gz -C /usr/local/
sudo tee /etc/profile.d/java.sh <<EOF
export JAVA_HOME=/usr/local/jdk-21.0.3
export PATH=\$JAVA_HOME/bin:\$PATH
EOF
source /etc/profile
```