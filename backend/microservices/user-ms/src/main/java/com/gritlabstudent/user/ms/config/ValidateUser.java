package com.gritlabstudent.user.ms.config;

import com.gritlabstudent.user.ms.exceptions.UserCollectionException;
import com.gritlabstudent.user.ms.models.User;
import com.gritlabstudent.user.ms.repositories.UserRepository;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;

public class ValidateUser {

    // autowire the UserRepository
    @Autowired
    private UserRepository userRepository;

    private boolean isThisEmailPresentInDB(String email) {
        var emails = userRepository.findAllEmails();
        if (emails.contains(email)) {
            return true;
        } else {
            return false;
        }
    }

    private boolean isEmailOfCurrentUser(String email, String id) {
        var user = userRepository.findById(id);
        if (user.isPresent()) {
            if (user.get().getEmail().equals(email)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public static void validateUser(User user) throws UserCollectionException {
        if (user.getName() != null) {
        } else {
            throw new UserCollectionException("User name" + UserCollectionException.NullException());
        }
        // if product.getDescription() is not null, trim, else throw exception
        if (user.getEmail() != null) {
            if (!isValidEmail(user.getEmail())) {
                throw new UserCollectionException(UserCollectionException.InvalidEmailException());
            }
            if (new ValidateUser().isThisEmailPresentInDB(user.getEmail())
                    && !(new ValidateUser().isEmailOfCurrentUser(user.getEmail(), user.getId()))) {
                throw new UserCollectionException(UserCollectionException.EmailAlreadyExists());
            }
        } else {
            throw new UserCollectionException("User email" + UserCollectionException.NullException());
        }
        if (user.getPassword() == null) {
            throw new UserCollectionException("User password" + UserCollectionException.NullException());
        }

        if (user.getRole() != null) {
            // check if role enum is either user.getRole() is "ROLE_SELLER" or "ROLE_CLIENT"
            if (!(user.getRole().equals("ROLE_SELLER") || user.getRole().equals("ROLE_CLIENT"))) {
                throw new UserCollectionException("User role" + UserCollectionException.InvalidRoleException());
            }
        } else {
            throw new UserCollectionException("User role" + UserCollectionException.NullException());
        }

    }

    private static final String EMAIL_REGEX = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@"
            + "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$";

    public static boolean isValidEmail(String email) {
        // Compile the regex pattern
        Pattern pattern = Pattern.compile(EMAIL_REGEX);

        // Match the input email against the pattern
        Matcher matcher = pattern.matcher(email);

        // Return true if it matches the pattern (valid format), false otherwise
        return matcher.matches();
    }
}
