package com.capgemini.devon.portalgateway.zuul;

import java.util.List;

import javax.inject.Inject;
import javax.inject.Named;

import org.apache.http.HttpHeaders;
import org.apache.http.client.utils.URIBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.netflix.util.Pair;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;

@Named
public class SendRedirectFilter extends ZuulFilter {

  private static final Logger LOG = LoggerFactory.getLogger(SendRedirectFilter.class);

  private ZuulRedirectConfigProperties configProperties;

  public SendRedirectFilter() {
    super();
  }

  @Inject
  public void setConfigProperties(ZuulRedirectConfigProperties configProperties) {

    this.configProperties = configProperties;
  }

  @Override
  public String filterType() {

    return "post";
  }

  @Override
  public int filterOrder() {

    return 500;
  }

  @Override
  public boolean shouldFilter() {

    return true;
  }

  @Override
  public Object run() {

    Pair<String, String> locationHeader = getLocationHeaderFromCurrentRequestContext();
    if (locationHeader != null) {
      String locationUri = locationHeader.second();
      String query = "";

      int queryPartBeginIndex = locationUri.indexOf("?");
      if (queryPartBeginIndex >= 0) {
        query = locationUri.substring(queryPartBeginIndex);
        locationUri = locationUri.substring(0, queryPartBeginIndex);
      }

      try {
        URIBuilder uriBuilder = new URIBuilder(locationUri);
        uriBuilder.setScheme(this.configProperties.getProtocol());
        uriBuilder.setHost(this.configProperties.getHost());
        uriBuilder.setPort(this.configProperties.getPort());
        locationHeader.setSecond(uriBuilder.build().toString() + query);
      } catch (Exception e) {
        LOG.warn("Redirect URI could not be created", e);
      }
    }
    return null;
  }

  private static Pair<String, String> getLocationHeaderFromCurrentRequestContext() {

    List<Pair<String, String>> responseHeaders = RequestContext.getCurrentContext().getZuulResponseHeaders();
    for (Pair<String, String> currentResponseHeader : responseHeaders) {
      if (HttpHeaders.LOCATION.equals(currentResponseHeader.first())) {
        return currentResponseHeader;
      }
    }
    return null;
  }
}
