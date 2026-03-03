-- =========================================================================
-- Script SQL para poblar catálogos obligatorios de ReSet API
-- Ejecutar este script en la base de datos PostgreSQL de ReSet
-- =========================================================================

-- Insertar Niveles de Craving (1-10)
INSERT INTO core.craving_levels (level, description, recommendation) VALUES
(1, 'Sin Ansiedad', 'Mantén lo que estás haciendo, felicidades.'),
(2, 'Leve - Pensamiento Fugaz', 'Distráete con una actividad ligera.'),
(3, 'Leve - Ligeramente molesto', 'Bebe agua, haz una pausa de 5 minutos.'),
(4, 'Moderado - Incómodo', 'Contacta a un amigo o da un pequeño paseo.'),
(5, 'Moderado - Constante', 'Revisa tus razones para mantenerte sobrio. Medita.'),
(6, 'Moderado Alto - Distractivo', 'Busca apoyo en la comunidad o lee un post del foro.'),
(7, 'Alto - Fuerte deseo', 'Llama a un contacto de emergencia de prioridad media.'),
(8, 'Alto - Muy difícil de ignorar', 'Llama a tu padrino o terapeuta inmediatamente.'),
(9, 'Severo - Al límite', 'Activa el Botón de Pánico. No te quedes solo.'),
(10, 'Severo - Urgencia Inminente', 'Emergencia. Llama a tu red de apoyo principal o al 911 si hay riesgo vital.')
ON CONFLICT (level) DO NOTHING;

-- Insertar Estados Emocionales (1-10)
INSERT INTO core.emotional_states (level, label, category) VALUES
(1, 'Deprimido / Muy Triste', 'Negativa'),
(2, 'Enojado / Frustrado', 'Negativa'),
(3, 'Ansioso / Preocupado', 'Negativa'),
(4, 'Estresado / Abrumado', 'Negativa'),
(5, 'Apatía / Indiferente', 'Neutral'),
(6, 'Aburrido', 'Neutral'),
(7, 'Tranquilo / Relajado', 'Positiva'),
(8, 'Contento / Satisfecho', 'Positiva'),
(9, 'Alegre / Motivado', 'Positiva'),
(10, 'Eufórico / Muy Feliz', 'Positiva')
ON CONFLICT (level) DO NOTHING;

-- Mensaje de confirmación
-- SELECT 'Catálogos insertados correctamente' AS resultado;
