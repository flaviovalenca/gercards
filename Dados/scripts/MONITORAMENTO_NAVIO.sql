-- *** SqlDbx Personal Edition ***
-- !!! Not licensed for commercial use beyound 90 days evaluation period !!!
-- For version limitations please check http://www.sqldbx.com/personal_edition.htm
-- Number of queries executed: 32695, number of rows retrieved: 179237


SELECT * FROM MONITORAMENTO_NAVIO

CREATE TABLE MONITORAMENTO_NAVIO
	(
	ID NUMBER (10) PRIMARY KEY,
	NOME_NAVIO VARCHAR2 (100),
	EST_DESCRICAO VARCHAR2 (100)
	)



INSERT INTO SYS.MONITORAMENTO_NAVIO (ID, NOME_NAVIO, EST_DESCRICAO, PASSWORD, ATIVO)
VALUES (1, 'FORTE DE SÃO MARCOS', 'ELCANO', 'fortesaomarcos2023', 'N');

INSERT INTO SYS.MONITORAMENTO_NAVIO (ID, NOME_NAVIO, EST_DESCRICAO, PASSWORD, ATIVO)
VALUES (2, 'FORTE DE SÃO JORGE', 'ELCANO', 'elcano2023', 'N');

INSERT INTO SYS.MONITORAMENTO_NAVIO (ID, NOME_NAVIO, EST_DESCRICAO, PASSWORD, ATIVO)
VALUES (3, 'SEVENRION', 'SUBSEA SEVEN', 'subsea2023', 'N');
