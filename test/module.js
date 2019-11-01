var defaultAge = 20,
	maxAge = 5,
	defaultColor = 'red',
	defaultStudents = ['JH', 'LI', 'XI'],
	defaultsFramework = {
		monitor: {
			name: 'JH',
			age: defaultAge,
		},
		groupLeader: {
			name: 'LI',
		},
		parter: {
			name: 'XI',
			
		}
	};

var monitor = defaultsFramework.monitor.name;
var manages = [defaultStudents[0], defaultsFramework.groupLeader.name];
maxAge = 6;
defaultsFramework.groupLeader.age = 10;
var num = 10 + maxAge;
defaultsFramework.parter.age = maxAge + defaultsFramework.groupLeader.age;

exports.monitor = monitor;