package com.gritlabstudent.user.ms.config;

import com.gritlabstudent.user.ms.exceptions.UserCollectionException;
import com.gritlabstudent.user.ms.models.User;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ValidateUser {
    public static void validateUser(User user) throws UserCollectionException {
        // trim each field
        user.setName(user.getName().trim());
        user.setEmail(user.getEmail().trim());
        user.setPassword(user.getPassword().trim());
        user.setRole(user.getRole().trim());

        if (user.getName() != null) {
            user.setName(user.getName().trim());
        } else {
            throw new UserCollectionException("User name" + UserCollectionException.NullException());
        }
        // if product.getDescription() is not null, trim, else throw exception
        if (user.getEmail() != null) {
            boolean isValid = isValidEmail(user.getEmail());
            System.out.println(user.getEmail() + " is valid email: " + isValid);
            if (!isValid) {
                throw new UserCollectionException(UserCollectionException.InvalidEmailException());
            }
            user.setEmail(user.getEmail().trim());
        } else {
            throw new UserCollectionException("User email" + UserCollectionException.NullException());
        }
        if (user.getPassword() != null) {
            user.setPassword(user.getPassword().trim()); // Trim the ID field as well
        } else {
            throw new UserCollectionException("User password" + UserCollectionException.NullException());
        }

        if (user.getRole() != null) {
            // check if role enum is either user.getRole() is "ROLE_SELLER" or "ROLE_CLIENT"
            if (!(user.getRole().equals("ROLE_SELLER") || user.getRole().equals("ROLE_CLIENT"))) {
                throw new UserCollectionException("User role" + UserCollectionException.InvalidRoleException());
            }
            user.setRole(user.getRole().trim());
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
