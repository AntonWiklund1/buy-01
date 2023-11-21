package AntonW.crudApi.controller;

import AntonW.crudApi.exceptions.UserCollectionException;
import AntonW.crudApi.models.User;
import AntonW.crudApi.models.UserDTO;
import AntonW.crudApi.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import javax.validation.ConstraintViolationException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/users") // The base URL for this controller
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Create User
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> createUser(@Valid @RequestBody User user) {
        try {
            userService.createUser(user);
            return new ResponseEntity<User>(user, HttpStatus.CREATED); // Changed from OK to CREATED (201)
        } catch (ConstraintViolationException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        } catch (UserCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred", HttpStatus.BAD_REQUEST);
        }
    }

    // Read All Users
    @GetMapping
    // @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    // Read User by Id
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<UserDTO> getUserById(@PathVariable String id) {
        UserDTO userDTO = userService.getUserById(id);
        if (userDTO != null) {
            return new ResponseEntity<>(userDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // Update User
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> updateUserById(@PathVariable("id") String id, @RequestBody User user) {
        try {
            userService.updateUser(id, user);
            return new ResponseEntity<>("Update User with id " + id, HttpStatus.OK);
        } catch (ConstraintViolationException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete User
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> deleteUserById(@PathVariable("id") String id) {
        try {
            userService.deleteUser(id);
            return new ResponseEntity<>("Successfully deleted user with id " + id, HttpStatus.OK);
        } catch (UserCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{id}/avatar")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> uploadAvatar(@PathVariable String id, @RequestParam("avatar") MultipartFile avatarFile) {
        try {
            userService.uploadUserAvatar(id, avatarFile);
            return new ResponseEntity<>("Avatar uploaded successfully", HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Could not upload the file: " + avatarFile.getOriginalFilename(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (UserCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}/avatar")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<?> getUserAvatar(@PathVariable String id) {
        try {
            UserDTO userDTO = userService.getUserById(id); // This method returns a UserDTO
            if (userDTO != null) {
                String avatarPath = userDTO.getAvatarImagePath();
                if (avatarPath != null && !avatarPath.isEmpty()) {
                    return ResponseEntity.ok().body(avatarPath);
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Avatar not set for user");
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with ID: " + id);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving the avatar path");
        }
    }

}
