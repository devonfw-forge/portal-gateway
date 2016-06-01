package com.capgemini.devon.portalgateway.zuul;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Dies sind die {@link ConfigurationProperties Konfigurationseinstellungen} für die Security von Adamas.
 *
 * @author mmatczak
 */
@Configuration
@ConfigurationProperties("zuul.redirect")
public class ZuulRedirectConfigProperties {

  private String protocol = "http";

  private String host = "localhost";

  private int port = 8080;

  public String getProtocol() {

    return this.protocol;
  }

  public void setProtocol(String protocol) {

    this.protocol = protocol;
  }

  public String getHost() {

    return this.host;
  }

  public void setHost(String host) {

    this.host = host;
  }

  public int getPort() {

    return this.port;
  }

  public void setPort(int port) {

    this.port = port;
  }

}
