微信公众号开发本地调试环境的搭建
==========

目前有很多网页是针对微信开发的，由于要根据授权链接获取code，而微信那边还会校验域名。因此很多时候在本地没法测试，上到测试环境调试又过于麻烦。因此我们通过nginx和修改host文件来搭建本地环境。  

以测试环境为例，测试环境的域名是`https://fac-h5.newtamp.cn`，主要要解决的问题如下：  
+ 将域名`https://fac-h5.newtamp.cn`指向本地`127.0.0.1`
+ 由于是`https`的，因此还需要生产`https`证书
+ 通过`https://fac-h5.newtamp.cn`访问到我们本地的服务

## 修改`hosts`文件  

这步比较简单，以`mac`系统为例：  

```bash
# 命令行输入
sudo vim /etc/hosts
# 最后一行添加 127.0.0.1 fac-h5.newtamp.cn
# 保存之后生效
```  
这个时候我们访问自己的服务的时候（假设是80端口起）就可以将访问域名改为`http://fac-h5.newtamp.cn`。  

## 本地生成https证书

上面我们将域名`fac-h5.newtamp.cn`指向了本地，但是因为测试环境的是`https`协议的，因此我们还需要在本地生成`https`证书，然后才能进行后续的配置，生成命令如下：  
```bash
# 生成私钥 privkey.pem
openssl genrsa -out privkey.pem 1024/2038
# 生成证书签名文件 server.pem
# 这里后面输入Common Name必须和我们要配置的域名保持一致
openssl req -new -x509 -key privkey.pem -out server.pem -days 365
```  

生成证书之后我们就可以在当前目录找到这两个文件，路径记录下来，后续有用。

# 通过nginx反向代理访问我们的服务  

由于对`nodejs`不是很熟，所以这里我采用了`nginx`反向代理来实现`https://fac-h5.newtamp.cn`访问服务。安装nginx教程网上都有，就不赘述了。下面贴出来反向代理的配置：

```bash
server {
    listen       443 ssl;
    server_name  fac-h5.newtamp.cn;
    
    # 证书签名文件
    ssl_certificate      /Users/apple/server.pem;
    # 证书签名文件
    ssl_certificate_key  /Users/apple/privkey.pem;

    ssl_session_cache    shared:SSL:1m;
    ssl_session_timeout  5m;

    ssl_ciphers  HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers  on;
    # 反向代理配置
    location / {
        index index.html;
        proxy_pass   http://localhost;
        proxy_redirect             off;
        proxy_set_header           Host $host;
        proxy_set_header           X-Real-IP $remote_addr;
        proxy_set_header           X-Forwarded-For $proxy_add_x_forwarded_for;
        client_max_body_size       20m;
    }
}
```

