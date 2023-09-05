# dev   http://192.168.178.81:88
# real  http://192.168.178.81:81

# Ubuntu
- User
	b2b/b2b123
	root/b2broot
- Postgresql
	postgres/pg12!@
- Restart
	- pm2 stop
	- pm2 start
	- pm2 0 = dev
	- pm2 1 = real
	- pm2 app = dev + real
	- pm2 status = មើល​ status app 

Database dev
Host: 192.168.178.81
Port: 5432
Database: b2bdoc_dev
Username: postgres
Pass: pg12!@

Database real
Host: 192.168.178.81
Port: 5432
Database: b2bdoc_real
Username: postgres
Pass: pg12!@