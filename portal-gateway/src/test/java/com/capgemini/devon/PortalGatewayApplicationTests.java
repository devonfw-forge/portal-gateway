package com.capgemini.devon;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.web.WebAppConfiguration;

import com.capgemini.devon.portalgateway.PortalGatewayApplication;

import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = PortalGatewayApplication.class)
@WebAppConfiguration
public class PortalGatewayApplicationTests {

	@Test
	public void contextLoads() {
	}

}
