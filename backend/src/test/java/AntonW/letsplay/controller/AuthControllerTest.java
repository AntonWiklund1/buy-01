package AntonW.crudApi.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import AntonW.crudApi.models.AuthRequest;
import AntonW.crudApi.models.User;
import AntonW.crudApi.service.JWTService;
import AntonW.crudApi.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@SpringBootTest
public class AuthControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JWTService jwtService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthController authController;

    @Test
    public void testAuthenticateAndGetToken_UserNotFound() {
        AuthRequest authRequest = new AuthRequest("username", "password");
        when(userRepository.findByName("username")).thenReturn(Optional.empty());

        ResponseEntity<?> result = authController.authenticateAndGetToken(authRequest);

        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        assertEquals("User not found", result.getBody());
    }

    @Test
    public void testAuthenticateAndGetToken_WrongPassword() {
        AuthRequest authRequest = new AuthRequest("username", "password");
        User user = new User();
        user.setName("username");
        user.setPassword("encodedPassword");
        when(userRepository.findByName("username")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "encodedPassword")).thenReturn(false);

        ResponseEntity<?> result = authController.authenticateAndGetToken(authRequest);

        assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode());
        assertEquals("Wrong password", result.getBody());
    }

    // Add more tests here
}
