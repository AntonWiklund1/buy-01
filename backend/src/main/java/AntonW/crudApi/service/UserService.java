package AntonW.crudApi.service;

import AntonW.crudApi.models.Product;
import AntonW.crudApi.models.User;
import AntonW.crudApi.models.UserDTO;
import AntonW.crudApi.repositories.UserRepository;
import AntonW.crudApi.repositories.ProductRepository;
import AntonW.crudApi.config.ValidateUser;
import AntonW.crudApi.exceptions.UserCollectionException;

import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import javax.validation.ConstraintViolationException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            ProductRepository productRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.productRepository = productRepository;
    }

    // Conversion Method
    public UserDTO convertToUserDTO(User user) {
        return new UserDTO(user.getId(), user.getName(), user.getRole());
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
        List<User> users = userRepository.findAll();
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
            // Find all products associated with the user and delete them
            List<Product> productsToDelete = productRepository.findByUserId(id);
            System.out.println("Products to delete: " + productsToDelete);
            for (Product product : productsToDelete) {
                productRepository.delete(product);
            }

            // Now delete the user
            userRepository.deleteById(id);

        }
    }
    public boolean checkUserCredentials(String username, String password) {
        Optional<User> userOptional = userRepository.findByName(username);
        return userOptional.isPresent() && passwordEncoder.matches(password, userOptional.get().getPassword());
    }

}
