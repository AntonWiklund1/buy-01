package com.gritlabstudent.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                .csrf(csrf -> csrf.disable()
                        .authorizeExchange(exchanges -> exchanges
                                        .pathMatchers("/api/auth/**").permitAll()
                                        .pathMatchers(HttpMethod.POST, "/api/users/**").permitAll()
                                        .pathMatchers(HttpMethod.GET, "/api/users").permitAll()
                                        .pathMatchers(HttpMethod.POST, "/api/products").permitAll()
                                        .pathMatchers(HttpMethod.GET, "/api/products").permitAll()
                                        .pathMatchers(HttpMethod.GET, "/media/**").permitAll()
                                        .pathMatchers(HttpMethod.GET, "/media").permitAll()
                                        .pathMatchers(HttpMethod.POST, "/media/upload").permitAll()
                                        .anyExchange().authenticated()
                        ));

        return http.build();
    }
}