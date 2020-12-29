-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-12-2020 a las 19:58:11
-- Versión del servidor: 10.4.17-MariaDB
-- Versión de PHP: 7.4.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `404_aw`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `answers`
--

CREATE TABLE `answers` (
  `ID` int(11) NOT NULL,
  `user` varchar(100) NOT NULL,
  `question` int(11) NOT NULL,
  `body` varchar(100) NOT NULL,
  `nLikes` int(11) NOT NULL DEFAULT 0,
  `nDislikes` int(11) NOT NULL DEFAULT 0,
  `date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `answers`
--

INSERT INTO `answers` (`ID`, `user`, `question`, `body`, `nLikes`, `nDislikes`, `date`) VALUES
(1, 'info@ucm.es', 2, 'Respouesta de rpueba del body tal cual xd', 0, 0, '2020-12-27'),
(2, 'a@ucm.es', 2, 'body de al answer', 0, 0, '2020-12-27'),
(5, 'a@ucm.es', 1, 'asdasdasd123123', 0, 0, '2020-12-27'),
(6, 'a@ucm.es', 2, 'otra respuesta mas de a@ucm.es', 0, 0, '2020-12-28'),
(8, 'info@ucm.es', 14, 'Buenos videos pa', 1, 0, '2020-12-29');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `answers_score`
--

CREATE TABLE `answers_score` (
  `IdAnswer` int(11) NOT NULL,
  `user` varchar(100) NOT NULL,
  `type` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `answers_score`
--

INSERT INTO `answers_score` (`IdAnswer`, `user`, `type`) VALUES
(8, 'info@ucm.es', 1);

--
-- Disparadores `answers_score`
--
DELIMITER $$
CREATE TRIGGER `updateAnswersScoreInsert` AFTER INSERT ON `answers_score` FOR EACH ROW BEGIN
	DECLARE userOrigin varchar(100);
    DECLARE questionOrigin varchar(100);
    
    SELECT a.question INTO questionOrigin
    FROM answers a
    WHERE a.ID = NEW.IdAnswer;
    
    SELECT q.user INTO userOrigin
    FROM questions q
    WHERE q.ID=questionOrigin;
    
IF NEW.type = 1 THEN
	UPDATE answers
    SET answers.nLikes = answers.nLikes+1
    WHERE answers.ID = NEW.IdAnswer;
        
    UPDATE users
    SET users.TotalScore = users.TotalScore +10
    WHERE users.email = userOrigin;
ELSE 
        UPDATE answers
        SET answers.nDislikes=answers.nDislikes+1
        WHERE answers.ID = NEW.IdAnswer;
         
        UPDATE users
        SET users.TotalScore = users.TotalScore-12
        WHERE users.email = userOrigin;
END IF;
    IF (SELECT users.TotalScore
        FROM users
        WHERE users.email = userOrigin) <1 THEN
        
          UPDATE users
          SET users.TotalScore =1
          WHERE users.email = userOrigin;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `updateAnswersScoreUpdate` AFTER UPDATE ON `answers_score` FOR EACH ROW BEGIN
	DECLARE userOrigin varchar(100);
    DECLARE questionOrigin varchar(100);
    
    SELECT a.question INTO questionOrigin
    FROM answers a
    WHERE a.ID = NEW.IdAnswer;
    
    SELECT q.user INTO userOrigin
    FROM questions q
    WHERE q.ID=questionOrigin;
    
IF OLD.TYPE <> NEW.type THEN
	IF NEW.type = 1 THEN
            UPDATE answers
            SET answers.nLikes = answers.nLikes+1,answers.nDislikes=answers.nDislikes-1
            WHERE answers.ID = NEW.IdAnswer;           
          
           -- Para actualizar las medallas de los likes
            IF (SELECT answers.nLikes
            	FROM answers
          		WHERE answers.ID = NEW.IdAnswer)=2 THEN 
                	INSERT INTO medals_user(IdUser, MedalType, MedalName) VALUES(userOrigin ,"Bronze","Respuesta interesante");
            ELSEIF (SELECT answers.nLikes
            		FROM answers
          			WHERE answers.ID = NEW.IdAnswer)=4 THEN 
                INSERT INTO medals_user(IdUser, MedalType, MedalName) VALUES(userOrigin,"Silver","Buena respuesta");
            ELSEIF (SELECT answers.nLikes
            		FROM answers
          			WHERE answers.ID = NEW.IdAnswer)=6 THEN 
                INSERT INTO medals_user(IdUser, MedalType, MedalName) VALUES(userOrigin,"Gold","Excelente respuesta");
           END IF;
                      

           IF (SELECT users.TotalScore
                FROM users
                WHERE users.email = userOrigin)<>1 THEN  

                UPDATE users
                SET users.TotalScore = users.TotalScore+12
                WHERE users.email = userOrigin;
           ELSE 
                UPDATE users
                SET users.TotalScore = users.TotalScore+10
                WHERE users.email = userOrigin;
           END IF;
	ELSE 
        	 -- Quitar las medallas si es necesario
            /*IF(SELECT questions.nLikes
            FROM questions
          	WHERE questions.ID = NEW.question) =1 THEN 
            	 DELETE FROM `medals_user`
                 WHERE medals_user.IdUser= NEW.user AND 
                 medals_user.MedalType = "Bronze" AND
                 medals_user.MedalName = "Estudiante";
                 
             ELSEIF (SELECT questions.nLikes
            FROM questions
          	WHERE questions.ID = NEW.question)=2 THEN 
               DELETE FROM `medals_user`
                 WHERE medals_user.IdUser= NEW.user AND 
                 medals_user.MedalType = "Bronze" AND
                 medals_user.MedalName = "Pregunta Interesante";
            ELSEIF (SELECT questions.nLikes
            FROM questions
          	WHERE questions.ID = NEW.question)=4 THEN 
                 DELETE FROM `medals_user`
                 WHERE medals_user.IdUser= NEW.user AND 
                 medals_user.MedalType = "Silver" AND
                 medals_user.MedalName = "Buena pregunta";
            ELSEIF (SELECT questions.nLikes
            FROM questions
          	WHERE questions.ID = NEW.question)=6 THEN 
                 DELETE FROM `medals_user`
                 WHERE medals_user.IdUser= NEW.user AND 
                 medals_user.MedalType = "Gold" AND
                 medals_user.MedalName = "Excelente pregunta";
           END IF;*/
    
            UPDATE answers
            SET answers.nDislikes=answers.nDislikes+1,
            answers.nLikes= answers.nLikes-1
            WHERE answers.ID = NEW.IdAnswer; 
            
            UPDATE users
            SET users.TotalScore = users.TotalScore-12
            WHERE users.email = userOrigin;
  	END IF;
    
        IF (SELECT users.TotalScore
            FROM users
            WHERE users.email = userOrigin) <1 THEN

             UPDATE users
             SET users.TotalScore =1
             WHERE users.email = userOrigin;
        END IF;
        
END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medals_user`
--

CREATE TABLE `medals_user` (
  `IdUser` varchar(100) NOT NULL,
  `MedalType` enum('Gold','Silver','Bronze') NOT NULL,
  `MedalName` varchar(100) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `medals_user`
--

INSERT INTO `medals_user` (`IdUser`, `MedalType`, `MedalName`, `date`) VALUES
('csegundo@ucm.es', 'Bronze', 'Estudiante', '2020-12-29 15:21:10'),
('csegundo@ucm.es', 'Bronze', 'Estudiante', '2020-12-29 15:22:40'),
('a@ucm.es', 'Bronze', 'Estudiante', '2020-12-29 17:11:18'),
('b@ucm.es', 'Bronze', 'Estudiante', '2020-12-29 17:19:04'),
('info@ucm.es', 'Bronze', 'Pregunta Popular', '2020-12-29 17:19:54'),
('b@ucm.es', 'Bronze', 'Estudiante', '2020-12-29 17:19:59'),
('info@ucm.es', 'Bronze', 'Pregunta Popular', '2020-12-29 18:18:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `questions`
--

CREATE TABLE `questions` (
  `ID` int(11) NOT NULL,
  `user` varchar(100) NOT NULL,
  `title` varchar(1000) NOT NULL,
  `body` varchar(1000) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `visits` int(11) NOT NULL DEFAULT 0,
  `nLikes` int(11) NOT NULL DEFAULT 0,
  `nDislikes` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `questions`
--

INSERT INTO `questions` (`ID`, `user`, `title`, `body`, `date`, `visits`, `nLikes`, `nDislikes`) VALUES
(1, 'csegundo@ucm.es', 'Pregunta de prueba', 'Cuerpo de la pregunta de prueba', '2020-12-08 11:38:57', 1, 1, 0),
(2, 'info@ucm.es', '¿para que sirve el padding?', 'No se para que sirve el padddinq ya que me confundo con el margin', '2020-12-10 10:48:36', 0, 0, 0),
(4, 'info@ucm.es', '¿Cómo funciona express?', 'No se importar modulos', '2020-12-12 18:49:14', 1, 0, 0),
(5, 'csegundo@ucm.es', 'title', 'bodyy', '2020-12-26 11:18:06', 2, 0, 1),
(10, 'a@ucm.es', 'TITULO DE PRUEBA DE CREACION', 'asda sd123 va sd', '2020-12-26 19:48:49', 0, 0, 0),
(11, 'a@ucm.es', 'nueva xd', 'asdasd asd asd asas ds', '2020-12-26 19:57:14', 0, 0, 0),
(13, 'a@ucm.es', 'assssssssss jajaja', 'bodyyyyyy de locos', '2020-12-29 18:10:02', 1, 0, 1),
(14, 'b@ucm.es', 'Pregunta de Verdejo', '¿Que son los hashmaps xd?', '2020-12-29 18:17:30', 2, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `questions_score`
--

CREATE TABLE `questions_score` (
  `question` int(11) NOT NULL,
  `user` varchar(100) NOT NULL,
  `type` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `questions_score`
--

INSERT INTO `questions_score` (`question`, `user`, `type`) VALUES
(1, 'a@ucm.es', 1),
(5, 'a@ucm.es', 0),
(13, 'a@ucm.es', 0),
(14, 'a@ucm.es', 1),
(14, 'info@ucm.es', 0);

--
-- Disparadores `questions_score`
--
DELIMITER $$
CREATE TRIGGER `updateQuestionScoreInsert` AFTER INSERT ON `questions_score` FOR EACH ROW BEGIN
	DECLARE userOrigin varchar(100);
    
    SELECT q.user INTO userOrigin
    FROM questions q
    WHERE q.ID = NEW.question;
    
	IF NEW.type = 1 THEN
        UPDATE questions
        SET questions.nLikes = questions.nLikes+1
        WHERE questions.id = NEW.question;
        
        INSERT INTO `medals_user`(`IdUser`, `MedalType`, `MedalName`) VALUES (userOrigin,"Bronze","Estudiante");
        
        UPDATE users
        SET users.TotalScore = users.TotalScore +10
        WHERE users.email = userOrigin;
    ELSE 
        UPDATE questions
        SET questions.nDislikes=questions.nDislikes+1
        WHERE questions.id = NEW.question;
         
        UPDATE users
        SET users.TotalScore = users.TotalScore-2
        WHERE users.email = userOrigin;
END IF;
    IF (SELECT users.TotalScore
        FROM users
        WHERE users.email = NEW.user) <1 THEN
			UPDATE users
			SET users.TotalScore =1
			WHERE users.email = userOrigin;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `updateQuestionScoreUpdate` AFTER UPDATE ON `questions_score` FOR EACH ROW BEGIN
	DECLARE userOrigin varchar(100);
    
    SELECT q.user INTO userOrigin
    FROM questions q
    WHERE q.ID=NEW.question;
    
	IF OLD.TYPE <> NEW.type THEN
		IF NEW.type = 1 THEN
			UPDATE questions
			SET questions.nLikes=questions.nLikes+1,             questions.nDislikes=questions.nDislikes-1
            WHERE questions.id = NEW.question;           
          
			-- Para actualizar las medallas de los likes
			IF(SELECT questions.nLikes
            	FROM questions
          		WHERE questions.ID = NEW.question)=1 THEN 
				INSERT INTO medals_user(IdUser, MedalType, MedalName) VALUES(userOrigin ,"Bronze","Estudiante");
			ELSEIF (SELECT questions.nLikes
            		FROM questions
          			WHERE questions.ID = NEW.question)=2 THEN 
                INSERT INTO medals_user(IdUser, MedalType, MedalName) VALUES(userOrigin ,"Bronze","Pregunta interesante");
            ELSEIF (SELECT questions.nLikes
            		FROM questions
          			WHERE questions.ID = NEW.question)=4 THEN 
                INSERT INTO medals_user(IdUser, MedalType, MedalName) VALUES(userOrigin ,"Silver","Buena pregunta");
            ELSEIF (SELECT questions.nLikes
            FROM questions
          	WHERE questions.ID = NEW.question)=6 THEN  
                INSERT INTO medals_user(IdUser, MedalType, MedalName) VALUES(userOrigin ,"Gold","Excelente pregunta");
           END IF;
                      

			IF (SELECT users.TotalScore
                FROM users
                WHERE users.email = NEW.user)<>1 THEN
				UPDATE users
                SET users.TotalScore = users.TotalScore+12
                WHERE users.email = userOrigin;
           ELSE 
                UPDATE users
                SET users.TotalScore = users.TotalScore+10
                WHERE users.email = userOrigin;
           END IF;
	ELSE 
    	
        	 -- Quitar las medallas si es necesario
            
            /*IF(SELECT questions.nLikes
            FROM questions
          	WHERE questions.ID = NEW.question) =1 THEN 
            	 DELETE FROM `medals_user`
                 WHERE medals_user.IdUser= NEW.user AND 
                 medals_user.MedalType = "Bronze" AND
                 medals_user.MedalName = "Estudiante";
                 
             ELSEIF (SELECT questions.nLikes
            FROM questions
          	WHERE questions.ID = NEW.question)=2 THEN 
               DELETE FROM `medals_user`
                 WHERE medals_user.IdUser= NEW.user AND 
                 medals_user.MedalType = "Bronze" AND
                 medals_user.MedalName = "Pregunta Interesante";
            ELSEIF (SELECT questions.nLikes
            FROM questions
          	WHERE questions.ID = NEW.question)=4 THEN 
                 DELETE FROM `medals_user`
                 WHERE medals_user.IdUser= NEW.user AND 
                 medals_user.MedalType = "Silver" AND
                 medals_user.MedalName = "Buena pregunta";
            ELSEIF (SELECT questions.nLikes
            FROM questions
          	WHERE questions.ID = NEW.question)=6 THEN 
                 DELETE FROM `medals_user`
                 WHERE medals_user.IdUser= NEW.user AND 
                 medals_user.MedalType = "Gold" AND
                 medals_user.MedalName = "Excelente pregunta";
           END IF;*/
    
            UPDATE questions
            SET questions.nDislikes=questions.nDislikes+1,
            questions.nLikes= questions.nLikes-1
            WHERE questions.id = NEW.question; 
            
            UPDATE users
            SET users.TotalScore = users.TotalScore-12
            WHERE users.email = userOrigin;
  	END IF;
    
        IF (SELECT users.TotalScore
            FROM users
            WHERE users.email = userOrigin) <1 THEN

             UPDATE users
             SET users.TotalScore =1
             WHERE users.email = userOrigin;
        END IF;
        
END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tags`
--

CREATE TABLE `tags` (
  `question` int(11) NOT NULL,
  `tagName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tags`
--

INSERT INTO `tags` (`question`, `tagName`) VALUES
(1, 'AW'),
(1, 'NODE'),
(4, 'AW');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `profileImg` varchar(200) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `TotalScore` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `email`, `username`, `password`, `profileImg`, `date`, `TotalScore`) VALUES
(1, 'csegundo@ucm.es', 'Carlitos', '123', '/resources/images/default.png', '2020-12-10 18:38:26', 9),
(2, 'davidf14@ucm.es', 'david10923', '123', '/resources/images/default.png', '2020-12-10 18:44:45', 1),
(3, 'info2@ucm.es', 'Casa de estudiantes 2', '123', '/resources/images/default.png', '2020-12-15 18:51:50', 1),
(4, 'info@ucm.es', 'Info Estudiantes', '123', '/resources/images/default.png', '2020-12-10 18:44:22', 1),
(5, 'a@ucm.es', 'Casa estudiantes', '123', '/resources/images/default.png', '2020-12-26 12:14:20', 1),
(6, 'b@ucm.es', 'Verdejo', '123', '/resources/images/default.png', '2020-12-29 18:16:56', 19);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `visits`
--

CREATE TABLE `visits` (
  `question` int(11) NOT NULL,
  `user` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `visits`
--

INSERT INTO `visits` (`question`, `user`) VALUES
(1, 'a@ucm.es'),
(4, 'info@ucm.es'),
(5, 'a@ucm.es'),
(5, 'info@ucm.es'),
(13, 'a@ucm.es'),
(14, 'a@ucm.es'),
(14, 'info@ucm.es');

--
-- Disparadores `visits`
--
DELIMITER $$
CREATE TRIGGER `totalVisits` AFTER INSERT ON `visits` FOR EACH ROW BEGIN 
    UPDATE questions
    SET questions.visits=questions.visits + 1
    WHERE questions.ID = NEW.question;

     -- Para actualizar las medallas de las visitas

          IF(SELECT questions.visits
            FROM questions
              WHERE questions.ID = NEW.question) =2 THEN 
                  INSERT INTO medals_user(IdUser,MedalType, MedalName)
                VALUES(NEW.user ,"Bronze","Pregunta Popular");
             ELSEIF (SELECT questions.visits
            FROM questions
              WHERE questions.ID = NEW.question)=4 THEN 
                INSERT INTO medals_user(IdUser,MedalType, MedalName) 
                VALUES(NEW.user ,"Silver","Pregunta Destacada");
            ELSEIF (SELECT questions.visits
            FROM questions
              WHERE questions.ID = NEW.question)=6 THEN 
                INSERT INTO medals_user(IdUser,MedalType, MedalName) 
                VALUES(NEW.user ,"Gold","Pregunta famosa");
           END IF;

END
$$
DELIMITER ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `user` (`user`),
  ADD KEY `question` (`question`);

--
-- Indices de la tabla `answers_score`
--
ALTER TABLE `answers_score`
  ADD PRIMARY KEY (`IdAnswer`,`user`),
  ADD KEY `user` (`user`);

--
-- Indices de la tabla `medals_user`
--
ALTER TABLE `medals_user`
  ADD KEY `IdUser` (`IdUser`);

--
-- Indices de la tabla `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `user` (`user`);

--
-- Indices de la tabla `questions_score`
--
ALTER TABLE `questions_score`
  ADD PRIMARY KEY (`question`,`user`) USING BTREE,
  ADD KEY `user` (`user`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`question`,`tagName`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_pk` (`email`) USING BTREE;

--
-- Indices de la tabla `visits`
--
ALTER TABLE `visits`
  ADD PRIMARY KEY (`question`,`user`),
  ADD KEY `user` (`user`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `answers`
--
ALTER TABLE `answers`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `questions`
--
ALTER TABLE `questions`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`email`),
  ADD CONSTRAINT `answers_ibfk_2` FOREIGN KEY (`question`) REFERENCES `questions` (`ID`);

--
-- Filtros para la tabla `answers_score`
--
ALTER TABLE `answers_score`
  ADD CONSTRAINT `answers_score_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`email`),
  ADD CONSTRAINT `answers_score_ibfk_2` FOREIGN KEY (`IdAnswer`) REFERENCES `answers` (`ID`);

--
-- Filtros para la tabla `medals_user`
--
ALTER TABLE `medals_user`
  ADD CONSTRAINT `medals_user_ibfk_1` FOREIGN KEY (`IdUser`) REFERENCES `users` (`email`),
  ADD CONSTRAINT `medals_user_ibfk_2` FOREIGN KEY (`IdUser`) REFERENCES `users` (`email`);

--
-- Filtros para la tabla `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`email`);

--
-- Filtros para la tabla `questions_score`
--
ALTER TABLE `questions_score`
  ADD CONSTRAINT `questions_score_ibfk_1` FOREIGN KEY (`question`) REFERENCES `questions` (`ID`),
  ADD CONSTRAINT `questions_score_ibfk_2` FOREIGN KEY (`user`) REFERENCES `users` (`email`);

--
-- Filtros para la tabla `tags`
--
ALTER TABLE `tags`
  ADD CONSTRAINT `tags_ibfk_1` FOREIGN KEY (`question`) REFERENCES `questions` (`ID`);

--
-- Filtros para la tabla `visits`
--
ALTER TABLE `visits`
  ADD CONSTRAINT `visits_ibfk_1` FOREIGN KEY (`question`) REFERENCES `questions` (`ID`),
  ADD CONSTRAINT `visits_ibfk_2` FOREIGN KEY (`user`) REFERENCES `users` (`email`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
