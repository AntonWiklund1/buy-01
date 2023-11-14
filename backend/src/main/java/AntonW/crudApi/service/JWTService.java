package AntonW.crudApi.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.security.SecureRandom;
import java.util.Base64;

@Component
public class JWTService {
    public static final String SECRET = generateRandomToken();

    /**
     * Generates a random token.
     * 
     * @implSpec This method generates a random token using the SecureRandom class.
     * @implNote To generate a random token is considered as a good practice.
     *
     * @return the randomly generated token
     */
    private static String generateRandomToken() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        System.out.println("Random token: " + Base64.getEncoder().encodeToString(bytes)); // for audit purpose
        return Base64.getEncoder().encodeToString(bytes);
    }

    /**
     * Extracts the username from the given token.
     *
     * @param token the token from which to extract the username
     * @return the extracted username as a string
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extracts the expiration date from a token.
     *
     * @param token the token from which to extract the expiration date
     * @return the expiration date extracted from the token
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extracts a claim from a token using the provided claims resolver function.
     *
     * @param token          the token from which to extract the claim
     * @param claimsResolver the function used to extract the claim from the token's
     *                       claims
     * @return the extracted claim value
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extracts all claims from a given token.
     *
     * @param token the token from which to extract the claims
     * @return the extracted claims
     */
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Checks if a given token is expired.
     *
     * @param token the token to be checked
     * @return true if the token is expired, false otherwise
     */
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Validates a token by comparing the username extracted from the token
     * with the username from the user details and checking if the token
     * has expired.
     *
     * @param token       the token to validate
     * @param userDetails the user details object containing the username
     * @return true if the token is valid, false otherwise
     */
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    /**
     * Generates a token for the given user name.
     * 
     * @implNote each token is consist of (Header[used algo], Payload[data], Verify
     *           Signature[Secret code]) which is known as claims in jwt.
     * 
     * @implSpec This method generates a token for the given user name using the JWT
     *           (JSON Web Token) standard.
     *
     * @param userName the user name for which to generate the token
     * @return the generated token
     */
    public String generateToken(String userName) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userName);
    }

    /**
     * Creates a JWT token with the provided claims and username.
     *
     * @param claims   a map containing the claims to be included in the token
     * @param userName the username to be included in the token
     * @return the generated JWT token
     */
    private String createToken(Map<String, Object> claims, String userName) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userName)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 30))
                .signWith(getSignKey(), SignatureAlgorithm.HS256).compact(); // add the signature key with my own SECRET
                                                                             // (so here we add 1'st and 3'ed jwt
                                                                             // components).
    }

    /**
     * Generates a sign key for the Java function.
     *
     * @return The generated sign key.
     */
    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}