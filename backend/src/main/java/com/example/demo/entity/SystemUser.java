import jakarta.annotation.Generated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

public class Systemuser{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)

    privete Long id;
    @Column(unique= true)
    private String 
}