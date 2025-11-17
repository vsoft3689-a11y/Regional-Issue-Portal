package com.regionalportal.advice;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * ✅ Clean version of ApiErrorResponse (no Swagger)
 * Used to send consistent error responses in JSON format.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiErrorResponse {

    private LocalDateTime timestamp;
    private int status;
    private String message;
    private String path;

    public static ApiErrorResponse of(int status, String message, String path) {
        return new ApiErrorResponse(LocalDateTime.now(), status, message, path);
    }
}
