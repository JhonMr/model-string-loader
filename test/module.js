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
		parter: 'XI'
	};

var monitor = defaultsFramework.monitor.name;
maxAge = 6;
//defaultsFramework.groupLeader.age = defaultAge + maxAge;

exports.monitor = monitor;