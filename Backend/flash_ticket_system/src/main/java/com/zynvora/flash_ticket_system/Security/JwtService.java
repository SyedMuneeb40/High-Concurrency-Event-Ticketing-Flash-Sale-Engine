package com.zynvora.flash_ticket_system.Security;



import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JwtService {
    
    private JwtProperties jwtProperties;

    //making key
    private SecretKey getSigningKey(){
        byte[] keyByte = Decoders.BASE64.decode(jwtProperties.getSecret());
        return Keys.hmacShaKeyFor(keyByte);
    }

    //generate jwt token
    public String generateAccessToken (UserDetails userDetails){

        return Jwts.builder()
                    .subject(userDetails.getUsername())
                    .claims(Map.of("roles",userDetails.getAuthorities()))
                    .issuedAt(new Date())
                    .expiration( new Date( System.currentTimeMillis() + jwtProperties.getAccessExpiration())
                    )
                    .signWith(getSigningKey())
                    .compact();
    }

    //generate refresh token ismein roles nhi dete 
    public String generateRefreshToken(UserDetails userDetails){

        return Jwts.builder()
                .subject(userDetails.getUsername())
                .expiration(new Date(System.currentTimeMillis() + jwtProperties.getRefreshExpiration()))
                .issuedAt(new Date())
                .signWith(getSigningKey())
                .compact();
    }

    //extract username fron accesstoken
    public String extractUsername(String Token){
        return extractClaims(Token)
                .getSubject();
    }

    //checking token is valid or not

    public boolean isValid (String token , UserDetails userDetails){
        return extractUsername(token).equals(userDetails.getUsername()) && extractClaims(token).getExpiration().before(new Date());
    }


    //extract claims

    public Claims extractClaims (String token){
        return Jwts.parser()
                    .verifyWith((javax.crypto.SecretKey)getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

    }

}
