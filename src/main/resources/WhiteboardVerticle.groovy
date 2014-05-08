def httpServer = vertx.createHttpServer()

httpServer.requestHandler { req ->
    def file = req.uri == "/" ? "index.html" : req.uri
    req.response.sendFile "webroot/$file"
}

def config = [ "prefix" : "/bus" ]
def sockJSServer = vertx.createSockJSServer(httpServer).bridge(config, [[:]], [[:]])

httpServer.listen(8181)

println "Up and at them!"