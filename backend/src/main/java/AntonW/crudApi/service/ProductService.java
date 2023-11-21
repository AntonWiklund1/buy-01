package AntonW.crudApi.service;

import AntonW.crudApi.exceptions.ProductCollectionException;
import AntonW.crudApi.models.User;
import AntonW.crudApi.models.Product;
import AntonW.crudApi.repositories.ProductRepository;
import AntonW.crudApi.repositories.UserRepository;
import AntonW.crudApi.config.ValidateProduct;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolationException;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ProductService(ProductRepository productRepository, UserRepository userRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public void createProduct(Product product) throws ConstraintViolationException, ProductCollectionException {
        ValidateProduct.validateProduct(product);
        if (product.getId() != null) {
            product.setProductid(product.uuidGenerator());
        }
        Optional<User> userOptional = userRepository.findById(product.getUserid().trim());

        if (userOptional.isEmpty()) {
            throw new ProductCollectionException(ProductCollectionException.UserNotFoundException());
        } else {
            productRepository.save(product);
        }
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(String id) {
        return productRepository.findById(id).orElse(null);
    }

    public void updateProduct(String id, Product product) throws ProductCollectionException {
        Optional<Product> productOptional = productRepository.findById(id);

        ValidateProduct.validateProduct(product);

        Optional<User> userOptional = userRepository.findById(product.getUserid().trim());

        if (productOptional.isPresent()) {
            if (productOptional.get().getName().equals(product.getName()) &&
                    productOptional.get().getDescription().equals(product.getDescription()) &&
                    productOptional.get().getPrice().equals(product.getPrice()) &&
                    productOptional.get().getQuantity() == (product.getQuantity()) &&
                    productOptional.get().getUserid().equals(product.getUserid())) {
                throw new ProductCollectionException(ProductCollectionException.NoChangesMadeException());
            } else if (userOptional.isEmpty()) {
                throw new ProductCollectionException(ProductCollectionException.UserNotFoundException());
            }
            Product productUpdate = productOptional.get();
            productUpdate.setName(product.getName());
            productUpdate.setDescription(product.getDescription());
            productUpdate.setPrice(product.getPrice());
            productUpdate.setQuantity(product.getQuantity());
            productUpdate.setUserId(product.getUserid());
            productRepository.save(productUpdate);
        } else {
            throw new ProductCollectionException(ProductCollectionException.NotFoundException(id));
        }
    }

    public void deleteProduct(String id) throws ProductCollectionException {
        Optional<Product> productOptional = productRepository.findById(id);
        if (!productOptional.isPresent()) {
            throw new ProductCollectionException(ProductCollectionException.NotFoundException(id));
        } else {
            productRepository.deleteById(id);
        }
    }

    public Iterable<Product> getProductsByUserId(String userId) {
        return productRepository.findByUserId(userId);

    }
}
