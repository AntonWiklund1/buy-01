package com.gritlabstudent.user.ms.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.validation.ConstraintViolationException;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.gritlabstudent.user.ms.config.ValidateUser;
import com.gritlabstudent.user.ms.exceptions.UserCollectionException;
import com.gritlabstudent.user.ms.models.User;
import com.gritlabstudent.user.ms.models.UserDTO;
import com.gritlabstudent.user.ms.repositories.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;

    }

    // Conversion Method
    public UserDTO convertToUserDTO(User user) {
        return new UserDTO(user.getId(), user.getName(), user.getRole(), user.getAvatarImagePath());
    }

    // Create User
    public User createUser(User user)
            throws ConstraintViolationException, UserCollectionException, NoSuchAlgorithmException {
        ValidateUser.validateUser(user);
        Optional<User> userOptional = userRepository.findByName(user.getName());
        if (userOptional.isPresent()) {
            throw new UserCollectionException(UserCollectionException.UserAlreadyExistException());
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Read All Users
    public List<UserDTO> getAllUsers() {
        List<User> users = (List<User>) userRepository.findAll();
        return users.stream().map(this::convertToUserDTO).collect(Collectors.toList());
    }

    // Read User by Id
    public UserDTO getUserById(String id) {
        Optional<User> optionalUser = userRepository.findById(id);
        return optionalUser.map(this::convertToUserDTO).orElse(null);
    }

    // Update User
    public User updateUser(String id, User updatedUser)
            throws ConstraintViolationException, UserCollectionException, NoSuchAlgorithmException {
        ValidateUser.validateUser(updatedUser);
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isEmpty()) {
            throw new UserCollectionException(UserCollectionException.NotFoundException(id));
        }
        updatedUser.setId(id);
        updatedUser.setName(updatedUser.getName());
        updatedUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        updatedUser.setRole(updatedUser.getRole());
        updatedUser.setEmail(updatedUser.getEmail());

        return userRepository.save(updatedUser);

    }

    // Delete User
    public void deleteUser(String id) throws UserCollectionException {
        Optional<User> userOptional = userRepository.findById(id);
        System.out.println("userOptional: " + userOptional);

        if (!userOptional.isPresent()) {
            throw new UserCollectionException(UserCollectionException.NotFoundException(id));
        } else {
            // Now delete the user
            userRepository.deleteById(id);

        }
    }

    public boolean checkUserCredentials(String username, String password) {
        Optional<User> userOptional = userRepository.findByName(username);
        return userOptional.isPresent() && passwordEncoder.matches(password, userOptional.get().getPassword());
    }

    public void uploadUserAvatar(String id, MultipartFile avatarFile) throws IOException, UserCollectionException {
        Optional<User> userOptional = userRepository.findById(id);
        if (!userOptional.isPresent()) {
            throw new UserCollectionException(UserCollectionException.NotFoundException(id));
        }

        User user = userOptional.get();
        String fileName = StringUtils.cleanPath(Objects.requireNonNull(avatarFile.getOriginalFilename()));
        Path filePath = Paths.get("media/avatars/" + fileName);
        Files.copy(avatarFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        user.setAvatarImagePath(filePath.toString());
        userRepository.save(user);
    }

    public boolean checkUserExistence(String userId) {
        System.out.println("Checking user existence for ID: " + userId);
        return userRepository.existsById(userId);
    }
}
