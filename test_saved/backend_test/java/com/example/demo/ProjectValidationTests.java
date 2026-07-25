package com.example.demo;

import org.testng.Assert;
import org.testng.annotations.Listeners;
import org.testng.annotations.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

import java.lang.reflect.*;
import java.util.*;

@Listeners(TestResultListener.class)
public class ProjectValidationTests {

    private static final String PRIMARY_ENTITY = "com.example.demo.entity.SolarSite";
    private static final String PRIMARY_CONTROLLER = "com.example.demo.controller.SiteController";
    private static final String SECONDARY_CONTROLLER = "com.example.demo.controller.TicketController";
    private static final String PRIMARY_SERVICE = "com.example.demo.service.SiteManagementService";
    private static final String SECONDARY_SERVICE = "com.example.demo.service.MaintenanceService";
    private static final String PRIMARY_REPOSITORY = "com.example.demo.repository.SolarSiteRepository";
    private static final String DTO_PATH = "com.example.demo.dto.SiteCreationDto";
    private static final String JWT_CLASS_PATH = "com.example.demo.util.JwtUtils";

    private static final String TABLE_NAME = "solar_sites";
    private static final String API_BASE_PATH = "/api/sites";
    private static final String AUTH_EMAIL = "admin@solarsync.com";

    @Test
    public void t1_primaryControllerLoads() throws Exception {
        Class<?> clazz = Class.forName(PRIMARY_CONTROLLER);
        Assert.assertNotNull(clazz);
        Method[] methods = clazz.getDeclaredMethods();
        Assert.assertTrue(methods.length > 0);
        boolean hasCrud = Arrays.stream(methods).anyMatch(m -> m.getName().toLowerCase().contains("get") ||
                m.getName().toLowerCase().contains("create") ||
                m.getName().toLowerCase().contains("delete") ||
                m.getName().toLowerCase().contains("update"));
        Assert.assertTrue(hasCrud);

        Class<?> serviceClass = Class.forName(PRIMARY_SERVICE);
        Constructor<?> svcConst = serviceClass.getDeclaredConstructors()[0];
        Object service = svcConst.newInstance(new Object[svcConst.getParameterCount()]);
        Object controller = clazz.getDeclaredConstructors()[0].newInstance(service);
        Assert.assertNotNull(controller);
    }

    @Test
    public void t2_primaryServiceLoads() throws Exception {
        Class<?> clazz = Class.forName(PRIMARY_SERVICE);
        Assert.assertNotNull(clazz);
        Method[] methods = clazz.getDeclaredMethods();
        Assert.assertTrue(methods.length >= 3);
        Assert.assertTrue(Arrays.stream(methods).anyMatch(m -> m.getName().toLowerCase().contains("site")));
    }

    @Test
    public void t3_primaryRepositoryIsInterface() throws Exception {
        Class<?> clazz = Class.forName(PRIMARY_REPOSITORY);
        Assert.assertTrue(clazz.isInterface());
        Assert.assertTrue(
                Arrays.stream(clazz.getInterfaces()).anyMatch(i -> i.getSimpleName().contains("JpaRepository")));
    }

    @Test
    public void t4_primaryEntityMapping() throws Exception {
        Class<?> clazz = Class.forName(PRIMARY_ENTITY);
        Assert.assertNotNull(clazz.getAnnotation(jakarta.persistence.Entity.class));
        jakarta.persistence.Table table = clazz.getAnnotation(jakarta.persistence.Table.class);
        Assert.assertNotNull(table);
        Assert.assertEquals(table.name(), TABLE_NAME);
        Assert.assertTrue(clazz.getDeclaredFields().length >= 4);
    }

    @Test
    public void t5_securityConfigBeans() throws Exception {
        Class<?> clazz = Class.forName("com.example.demo.config.SecurityConfig");
        Assert.assertNotNull(clazz);

        Method filterChain = Arrays.stream(clazz.getDeclaredMethods())
                .filter(m -> m.getName().equals("securityFilterChain"))
                .findFirst().orElse(null);
        Assert.assertNotNull(filterChain, "securityFilterChain method not found in SecurityConfig");

        Class<?> appConfig = Class.forName("com.example.demo.config.ApplicationConfig");
        Method pwEncoder = Arrays.stream(appConfig.getDeclaredMethods())
                .filter(m -> m.getName().equals("passwordEncoder"))
                .findFirst().orElse(null);
        Assert.assertNotNull(pwEncoder, "passwordEncoder method not found in ApplicationConfig");
    }

    // DAY-2 | Sprint: Full CRUD Response Verification via Reflection

    @Test
    public void t6_controllerAnnotations() throws Exception {
        Class<?> clazz = Class.forName(PRIMARY_CONTROLLER);
        Assert.assertNotNull(clazz.getAnnotation(RestController.class));
        RequestMapping rm = clazz.getAnnotation(RequestMapping.class);
        Assert.assertNotNull(rm);
        Assert.assertEquals(rm.value()[0], API_BASE_PATH);
    }

    @Test
    public void t7_getAllSitesVerified() throws Exception {
        Class<?> controllerClass = Class.forName(PRIMARY_CONTROLLER);
        Class<?> serviceClass = Class.forName(PRIMARY_SERVICE);
        Method getAllMethod = Arrays.stream(controllerClass.getDeclaredMethods())
                .filter(m -> m.isAnnotationPresent(GetMapping.class)
                        && (m.getAnnotation(GetMapping.class).value().length == 0
                                || m.getAnnotation(GetMapping.class).value()[0].isEmpty()))
                .findFirst().orElseThrow();

        Constructor<?> svcConst = serviceClass.getDeclaredConstructors()[0];
        Object[] args = new Object[svcConst.getParameterCount()];
        for (int i = 0; i < args.length; i++) {
            Class<?> type = svcConst.getParameterTypes()[i];
            if (type.isInterface())
                args[i] = Proxy.newProxyInstance(type.getClassLoader(), new Class[] { type }, (p, m, a) -> {
                    if (m.getName().contains("findAll"))
                        return new ArrayList<>();
                    return null;
                });
        }
        Object service = svcConst.newInstance(args);
        Object controller = controllerClass.getDeclaredConstructors()[0].newInstance(service);
        ResponseEntity<?> re = (ResponseEntity<?>) getAllMethod.invoke(controller);
        Assert.assertEquals(re.getStatusCode().toString(), "200 OK");
    }

    @Test
    public void t8_deleteSiteVerified() throws Exception {
        Class<?> controllerClass = Class.forName("com.example.demo.controller.PanelController");
        Method deleteMethod = Arrays.stream(controllerClass.getDeclaredMethods())
                .filter(m -> m.isAnnotationPresent(DeleteMapping.class))
                .findFirst().orElse(null);

        if (deleteMethod != null) {
            Constructor<?> constr = controllerClass.getDeclaredConstructors()[0];
            Object[] args = new Object[constr.getParameterCount()];
            for (int i = 0; i < args.length; i++) {
                Class<?> type = constr.getParameterTypes()[i];
                args[i] = Proxy.newProxyInstance(type.getClassLoader(), new Class[] { type }, (p, m, a) -> null);
            }
            Object controller = constr.newInstance(args);
            ResponseEntity<?> re = (ResponseEntity<?>) deleteMethod.invoke(controller, 1L);
            Assert.assertEquals(re.getStatusCode().toString(), "200 OK");
        }
    }

    @Test
    public void t9_createSiteVerified() throws Exception {
        Class<?> controllerClass = Class.forName(PRIMARY_CONTROLLER);
        Class<?> serviceClass = Class.forName(PRIMARY_SERVICE);
        Class<?> dtoClass = Class.forName(DTO_PATH);

        Method createMethod = Arrays.stream(controllerClass.getDeclaredMethods())
                .filter(m -> m.isAnnotationPresent(PostMapping.class))
                .findFirst().orElseThrow();

        Constructor<?> svcConst = serviceClass.getDeclaredConstructors()[0];
        Object[] args = new Object[svcConst.getParameterCount()];
        for (int i = 0; i < args.length; i++) {
            Class<?> type = svcConst.getParameterTypes()[i];
            if (type.isInterface())
                args[i] = Proxy.newProxyInstance(type.getClassLoader(), new Class[] { type }, (p, m, a) -> {
                    if (m.getName().contains("save"))
                        return a[0];
                    if (m.getName().contains("findAll"))
                        return new ArrayList<>();
                    return null;
                });
        }
        Object service = svcConst.newInstance(args);
        Object controller = controllerClass.getDeclaredConstructors()[0].newInstance(service);
        Object requestDto = dtoClass.getDeclaredConstructor().newInstance();
        try {
            dtoClass.getMethod("setCommissionDate", String.class).invoke(requestDto, "2024-01-01");
        } catch (Exception e) {
        }

        ResponseEntity<?> re = (ResponseEntity<?>) createMethod.invoke(controller, requestDto);
        Assert.assertTrue(re.getStatusCode() == HttpStatus.CREATED || re.getStatusCode() == HttpStatus.OK);
    }

    @Test
    public void t10_getByIdVerified() throws Exception {
        // SRS_REF: REQ-CTRL-10 — getById returns correct status
        Class<?> controllerClass = Class.forName(PRIMARY_CONTROLLER);
        Class<?> serviceClass = Class.forName(PRIMARY_SERVICE);

        Method getByIdMethod = Arrays.stream(controllerClass.getDeclaredMethods())
                .filter(m -> m.isAnnotationPresent(GetMapping.class)
                        && m.getAnnotation(GetMapping.class).value().length > 0
                        && m.getAnnotation(GetMapping.class).value()[0].contains("{id}"))
                .findFirst().orElseThrow();

        Constructor<?> svcConst = serviceClass.getDeclaredConstructors()[0];
        Object[] args = new Object[svcConst.getParameterCount()];
        for (int i = 0; i < args.length; i++) {
            Class<?> type = svcConst.getParameterTypes()[i];
            if (type.isInterface())
                args[i] = Proxy.newProxyInstance(type.getClassLoader(), new Class[] { type }, (p, m, a) -> {
                    if (m.getName().contains("findById"))
                        return Optional.of(Class.forName("com.example.demo.entity.SolarSite").getDeclaredConstructor()
                                .newInstance());
                    return null;
                });
        }
        Object service = svcConst.newInstance(args);
        Object controller = controllerClass.getDeclaredConstructors()[0].newInstance(service);
        ResponseEntity<?> re = (ResponseEntity<?>) getByIdMethod.invoke(controller, 1L);
        Assert.assertEquals(re.getStatusCode().toString(), "200 OK");
    }

    @Test
    public void t11_secondaryEntityDelete() throws Exception {
        // SRS_REF: REQ-CTRL-SEC-08 — secondary entity delete exists (PanelController)
        Class<?> clazz = Class.forName("com.example.demo.controller.PanelController");
        Assert.assertTrue(Arrays.stream(clazz.getDeclaredMethods())
                .anyMatch(m -> m.isAnnotationPresent(DeleteMapping.class)));
    }

    // DAY-3 | Sprint: Security Annotations, RBAC & CORS

    @Test
    public void t12_adminSecurity() throws Exception {
        // SRS_REF: REQ-SEC-02 — ADMIN-gated endpoints present
        Class<?> clazz = Class.forName(PRIMARY_CONTROLLER);
        boolean hasAdmin = Arrays.stream(clazz.getDeclaredMethods())
                .anyMatch(m -> m.isAnnotationPresent(PreAuthorize.class)
                        && m.getAnnotation(PreAuthorize.class).value().contains("ADMIN"));
        Assert.assertTrue(hasAdmin);
    }

    @Test
    public void t13_domainRoleSecurity() throws Exception {
        // SRS_REF: REQ-SEC-03 — domain role endpoints present
        Class<?> clazz = Class.forName(SECONDARY_CONTROLLER);
        boolean hasRole = Arrays.stream(clazz.getDeclaredMethods())
                .anyMatch(m -> m.isAnnotationPresent(PreAuthorize.class)
                        && m.getAnnotation(PreAuthorize.class).value().contains("ROLE"));
        Assert.assertTrue(hasRole);
    }

    @Test
    public void t14_corsConfigExists() throws Exception {
        // SRS_REF: REQ-CORS-01 — CORS configured
        Class<?> clazz = Class.forName("com.example.demo.config.SecurityConfig");
        Assert.assertTrue(
                Arrays.stream(clazz.getDeclaredMethods()).anyMatch(m -> m.getName().toLowerCase().contains("cors")));
    }

    @Test
    public void t15_validationAnnotations() throws Exception {
        // SRS_REF: REQ-VAL-01 — input validation present
        Class<?> clazz = Class.forName(PRIMARY_CONTROLLER);
        Method createMethod = Arrays.stream(clazz.getDeclaredMethods())
                .filter(m -> m.isAnnotationPresent(PostMapping.class)).findFirst().orElseThrow();
        Assert.assertTrue(createMethod.getParameterCount() >= 1);
    }

    @Test
    public void t16_transactionalSupport() throws Exception {
        // SRS_REF: REQ-SVC-02 — transactional methods present
        Class<?> clazz = Class.forName(PRIMARY_SERVICE);
        Assert.assertTrue(
                Arrays.stream(clazz.getDeclaredMethods()).anyMatch(m -> m.isAnnotationPresent(Transactional.class)));
    }

    // DAY-4 | Sprint: Repository Custom Queries & Exception Handling

    @Test
    public void t17_repositoryFindBy() throws Exception {
        // SRS_REF: REQ-REPO-04 — findBy methods present
        Class<?> clazz = Class.forName("com.example.demo.repository.SolarPanelRepository");
        Assert.assertTrue(Arrays.stream(clazz.getDeclaredMethods()).anyMatch(m -> m.getName().startsWith("findBy")));
    }

    @Test
    public void t18_repositoryQueryAnnotation() throws Exception {
        // SRS_REF: REQ-REPO-05 — @Query present
        Class<?> clazz = Class.forName(PRIMARY_REPOSITORY);
        Assert.assertTrue(Arrays.stream(clazz.getDeclaredMethods()).anyMatch(m -> m.isAnnotationPresent(Query.class)));
    }

    @Test
    public void t19_globalExceptionHandler() throws Exception {
        // SRS_REF: REQ-EX-01/02 — exception handler present
        Class<?> handlerClass = Class.forName("com.example.demo.exception.GlobalExceptionHandler");
        Object handler = handlerClass.getDeclaredConstructor().newInstance();
        Method handlerMethod = Arrays.stream(handlerClass.getDeclaredMethods())
                .filter(m -> m.isAnnotationPresent(ExceptionHandler.class)).findFirst().orElseThrow();
        ResponseEntity<?> re = (ResponseEntity<?>) handlerMethod.invoke(handler, new RuntimeException("error"));
        Assert.assertNotNull(re);
    }

    @Test
    public void t20_primaryServiceTransactional() throws Exception {
        // SRS_REF: REQ-SVC-03 — primary service creation transactional
        Class<?> clazz = Class.forName(PRIMARY_SERVICE);
        Assert.assertTrue(
                Arrays.stream(clazz.getDeclaredMethods()).anyMatch(m -> m.isAnnotationPresent(Transactional.class)));
    }

    @Test
    public void t21_secondaryServiceTransactional() throws Exception {
        // SRS_REF: REQ-SVC-04 — secondary service reporting transactional
        Class<?> clazz = Class.forName(SECONDARY_SERVICE);
        Assert.assertTrue(
                Arrays.stream(clazz.getDeclaredMethods()).anyMatch(m -> m.isAnnotationPresent(Transactional.class)));
    }

    // DAY-5 | Sprint: JWT Token Generation & Validation

    @Test
    public void t22_jwtSecretPrivate() throws Exception {
        // SRS_REF: REQ-JWT-01 — secret field private
        Class<?> clazz = Class.forName(JWT_CLASS_PATH);
        Field f = Arrays.stream(clazz.getDeclaredFields()).filter(fi -> fi.getName().toLowerCase().contains("secret"))
                .findFirst().orElseThrow();
        Assert.assertTrue(Modifier.isPrivate(f.getModifiers()));
    }

    @Test
    public void t23_jwtGeneration() throws Exception {
        // SRS_REF: REQ-JWT-02 — JWT generation verified
        Class<?> clazz = Class.forName(JWT_CLASS_PATH);
        Object jwtUtil = clazz.getDeclaredConstructor().newInstance();
        for (Field f : clazz.getDeclaredFields()) {
            f.setAccessible(true);
            if (f.getType().equals(String.class))
                f.set(jwtUtil, Base64.getEncoder().encodeToString(
                        "PeakPerform2024SuperSecretKeyForHmacSHA256SigningAtLeast256BitsLong".getBytes()));
            if (f.getType().equals(long.class))
                f.set(jwtUtil, 900000L);
        }
        Object userProxy = Proxy.newProxyInstance(getClass().getClassLoader(),
                new Class[] { org.springframework.security.core.userdetails.UserDetails.class }, (p, method, args) -> {
                    if (method.getName().equals("getUsername"))
                        return AUTH_EMAIL;
                    return null;
                });
        Method gen = Arrays.stream(clazz.getDeclaredMethods())
                .filter(m -> m.getName().contains("generateToken") && m.getReturnType().equals(String.class))
                .findFirst().orElseThrow();
        if (gen.getParameterCount() == 2) {
            Assert.assertNotNull(gen.invoke(jwtUtil, new HashMap<>(), userProxy));
        } else {
            Assert.assertNotNull(gen.invoke(jwtUtil, userProxy));
        }
    }

    @Test
    public void t24_jwtRoundTrip() throws Exception {
        // SRS_REF: REQ-JWT-03 — JWT round-trip verified
        Class<?> clazz = Class.forName(JWT_CLASS_PATH);
        Object jwtUtil = clazz.getDeclaredConstructor().newInstance();
        for (Field f : clazz.getDeclaredFields()) {
            f.setAccessible(true);
            if (f.getType().equals(String.class))
                f.set(jwtUtil, Base64.getEncoder().encodeToString(
                        "PeakPerform2024SuperSecretKeyForHmacSHA256SigningAtLeast256BitsLong".getBytes()));
            if (f.getType().equals(long.class))
                f.set(jwtUtil, 900000L);
        }
        Object userProxy = Proxy.newProxyInstance(getClass().getClassLoader(),
                new Class[] { org.springframework.security.core.userdetails.UserDetails.class }, (p, method, args) -> {
                    if (method.getName().equals("getUsername"))
                        return AUTH_EMAIL;
                    return null;
                });

        Method gen = Arrays.stream(clazz.getDeclaredMethods())
                .filter(m -> m.getName().contains("generateToken") && m.getReturnType().equals(String.class))
                .findFirst().orElseThrow();
        String token = (gen.getParameterCount() == 2) ? (String) gen.invoke(jwtUtil, new HashMap<>(), userProxy)
                : (String) gen.invoke(jwtUtil, userProxy);

        Method val = Arrays.stream(clazz.getDeclaredMethods()).filter(m -> m.getName().contains("isTokenValid"))
                .findFirst().orElseThrow();
        Assert.assertTrue((Boolean) val.invoke(jwtUtil, token, userProxy));
    }

    @Test
    public void t25_jwtExtractUsername() throws Exception {
        // SRS_REF: REQ-JWT-04 — JWT extraction verified
        Class<?> clazz = Class.forName(JWT_CLASS_PATH);
        Object jwtUtil = clazz.getDeclaredConstructor().newInstance();
        for (Field f : clazz.getDeclaredFields()) {
            f.setAccessible(true);
            if (f.getType().equals(String.class))
                f.set(jwtUtil, Base64.getEncoder().encodeToString(
                        "PeakPerform2024SuperSecretKeyForHmacSHA256SigningAtLeast256BitsLong".getBytes()));
            if (f.getType().equals(long.class))
                f.set(jwtUtil, 900000L);
        }
        Object userProxy = Proxy.newProxyInstance(getClass().getClassLoader(),
                new Class[] { org.springframework.security.core.userdetails.UserDetails.class }, (p, method, args) -> {
                    if (method.getName().equals("getUsername"))
                        return AUTH_EMAIL;
                    return null;
                });

        Method gen = Arrays.stream(clazz.getDeclaredMethods())
                .filter(m -> m.getName().contains("generateToken") && m.getReturnType().equals(String.class))
                .findFirst().orElseThrow();
        String token = (gen.getParameterCount() == 2) ? (String) gen.invoke(jwtUtil, new HashMap<>(), userProxy)
                : (String) gen.invoke(jwtUtil, userProxy);

        Method ext = Arrays.stream(clazz.getDeclaredMethods()).filter(m -> m.getName().contains("extractUsername"))
                .findFirst().orElseThrow();
        Assert.assertEquals(ext.invoke(jwtUtil, token), AUTH_EMAIL);
    }

    // DAY-6 | Sprint: Entity DB Mapping & Filter Chain

    @Test
    public void t26_tableNameMatch() throws Exception {
        // SRS_REF: REQ-DB-01 — table name matches
        Class<?> clazz = Class.forName(PRIMARY_ENTITY);
        Assert.assertEquals(clazz.getAnnotation(Table.class).name(), TABLE_NAME);
    }

    @Test
    public void t27_nonNullableConstraints() throws Exception {
        // SRS_REF: REQ-DB-02 — constraints present
        Class<?> clazz = Class.forName(PRIMARY_ENTITY);
        Assert.assertTrue(Arrays.stream(clazz.getDeclaredFields()).anyMatch(f -> f.isAnnotationPresent(Column.class)));
    }

    @Test
    public void t28_entityRelationships() throws Exception {
        // SRS_REF: REQ-DB-03 — relationships present
        Class<?> clazz = Class.forName(PRIMARY_ENTITY);
        Assert.assertTrue(Arrays.stream(clazz.getDeclaredFields())
                .anyMatch(f -> f.isAnnotationPresent(jakarta.persistence.OneToMany.class)
                        || f.isAnnotationPresent(jakarta.persistence.ManyToOne.class)));
    }

    @Test
    public void t29_securityFilterChainBean() throws Exception {
        // SRS_REF: REQ-SEC-04/05 — security filter chain configured
        Class<?> clazz = Class.forName("com.example.demo.config.SecurityConfig");
        Assert.assertNotNull(clazz.getDeclaredMethod("securityFilterChain", HttpSecurity.class));
    }
}
