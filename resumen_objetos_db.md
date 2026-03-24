# Resumen de Objetos y Lógica — ReSet App

Este documento detalla los flujos de trabajo (Workflows), Vistas SQL, Consultas comunes y Funciones Definidas por el Usuario (UDFs) que componen la lógica central de la plataforma ReSet.

---

## 1. Workflows (WF) / Casos de Uso Principales

Representan los flujos de lógica de negocio distribuidos en los módulos de la aplicación NestJS.

### **Módulo de Autenticación (Auth)**
*   **WF-AU-01: Registro y Verificación:** Creación de cuenta, envío de correo de bienvenida y verificación de email.
*   **WF-AU-02: Autenticación Segura:** Login estándar con desafío 2FA (OTP via email) y manejo de dispositivos de confianza.
*   **WF-AU-03: Login Administrativo:** Acceso dedicado para administradores sin 2FA.
*   **WF-AU-04: Gestión de Perfil:** Actualización de datos, cambio de contraseña y "soft-delete" de cuenta.

### **Módulo de Seguimiento (Tracking) y Rachas (Streak)**
*   **WF-TR-01: Registro Diario (Daily Log):** Entrada de consumo, nivel de deseo (craving) y estado emocional. Dispara automáticamente la actualización de racha.
*   **WF-TR-02: Detección de Ausencias:** Proceso automático (Cron Job) que detecta si el usuario ha dejado de registrar actividad por más de 48 horas para pausar su racha.
*   **WF-TR-03: Análisis de Progreso:** Cálculo de promedios móviles y estadísticas de recaídas.

### **Módulo de Patrocinio (Sponsorship)**
*   **WF-SP-01: Vinculación:** Asignación de padrino mediante código de patrocinio y sistema de solicitudes (Aceptar/Rechazar).
*   **WF-SP-02: Graduación:** Flujo para ascender a un usuario de rol 'ADICTO' a 'PADRINO' tras cumplir sus metas.
*   **WF-SP-03: Terminación:** Finalización de la relación de patrocinio por decisión de alguna de las partes.

### **Módulo de Emergencia**
*   **WF-EM-01: Botón de Pánico:** Disparo de alertas inmediatas que notifican a los contactos de emergencia registrados.

---

## 2. Vistas SQL (Window Functions)

Utilizadas para reportes complejos y analítica de usuario en tiempo real, optimizadas mediante funciones de ventana.

| Vista | Descripción |
| :--- | :--- |
| `tracking.v_user_latest_log` | **WF-01:** Obtiene el registro más reciente de cada usuario, incluyendo niveles de deseo y emoción. |
| `tracking.v_user_craving_moving_avg` | **WF-02:** Calcula el promedio móvil de 7 días para el deseo y estado emocional del usuario. |
| `tracking.v_user_best_streaks` | **WF-03:** Genera un ranking de las mejores rachas alcanzadas por el usuario, comparándolas contra su récord personal. |

---

## 3. Consultas SELECT Comunes (Patrones Frecuentes)

Queries optimizados que la API ejecuta con frecuencia:

*   **Búsqueda de Perfil:** `SELECT * FROM auth.users WHERE email = $1 OR id = $2;`
*   **Historial de Actividad:** `SELECT dl.*, cl.level, es.level FROM tracking.daily_logs dl JOIN core.craving_levels cl...` (Con ordenamiento descendente por fecha).
*   **Contactos Prioritarios:** `SELECT * FROM emergency.support_contacts WHERE user_id = $1 AND is_active = TRUE ORDER BY priority_order;`
*   **Métricas Admin:** Agregaciones globales para el dashboard (Usuarios totales, logs diarios, tasas de recaída por tipo de adicción).

---

## 4. User Defined Functions (UDF) & Triggers

Lógica de integridad y negocio que reside directamente en PostgreSQL.

| Función / Trigger | Descripción |
| :--- | :--- |
| `core.fn_update_streak()` | **Trigger:** Se ejecuta tras cada log insertado. Calcula si la racha debe aumentar, reiniciarse (recaída) o reactivarse. |
| `tracking.fn_detect_absence()` | **UDF:** Función de mantenimiento que identifica usuarios inactivos y cambia el estado de la racha a 'paused'. |
| `emergency.fn_trigger_alert()` | **UDF:** Centraliza la creación de alertas de emergencia y valida la existencia de contactos activos. |
| `core.fn_get_user_stats()` | **UDF:** Retorna en una sola llamada los promedios de deseo, emoción y conteo de recaídas de los últimos 30 días. |
| `core.fn_graduate_user()` | **UDF:** Cambia el rol de ADICTO a PADRINO, genera código de patrocinio y cierra patrocinios previos. |
| `core.fn_relapse_user()` | **UDF:** Realiza la degradación de rol de PADRINO a ADICTO tras registrar una recaída. |
| `core.fn_close_sponsorship()` | **UDF:** Realiza el cierre administrativo de un patrocinio activo con una razón específica. |

---

*Nota: Este resumen se basa en las definiciones encontradas en los repositorios `resetBack-end` y `reset-infra`.*
