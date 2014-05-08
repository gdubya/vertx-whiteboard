package com.garethwestern.vertx;

import org.vertx.java.core.Handler;
import org.vertx.java.core.http.HttpServer;
import org.vertx.java.core.http.HttpServerRequest;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.platform.Verticle;

public class WhiteboardVerticle extends Verticle {

    @Override
    public void start() {
        final Logger logger = container.logger();

        final HttpServer httpServer = vertx.createHttpServer();

        httpServer.requestHandler(new Handler<HttpServerRequest>() {
            @Override
            public void handle(HttpServerRequest request) {
                String file = request.uri().equals("/") ? "index.html" : request.uri();
                request.response().sendFile("webroot/" + file);
            }
        });

        JsonObject config = new JsonObject();
        config.putString("prefix", "/bus");
        JsonArray noPermitted = new JsonArray();
        noPermitted.add(new JsonObject());
        vertx.createSockJSServer(httpServer).bridge(config, noPermitted, noPermitted );

        String host = container.config().getString("host");
        Integer port = container.config().getInteger("port");
        httpServer.listen(port, host);

        logger.info("Up and at them on " + host + ":" + port);
    }
}
