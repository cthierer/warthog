var React = require('react'),
    ReactDOM = require('react-dom'),
    http = require('http'),
    _ = require('lodash'),
    bluebird = require('bluebird');

function getMatches (player, token) {
    var deferred = bluebird.pending(),
        req;

    if (!_.isString(player) || _.isEmpty(player)) {
        return bluebird.reject('No players specified');
    }

    req = http.request({
        hostname: 'localhost',
        port: 8081,
        path: '/stats/h5/players/' + player + '/matches',
        headers: {
            'X-APIToken': token
        }
    }, function (res) {
        var body = '';

        res.on('data', function (data) {
            body += data;
        });

        res.on('end', function () {
            var jsonBody = JSON.parse(body);
            deferred.resolve(jsonBody);
        });
    }).on('error', function (e) {
        deferred.reject(e);
    });

    req.end();

    return deferred.promise;
}

var Match = React.createClass({
    render: function () {
        return (
            <div className="match">
                <h3>Match</h3>
                <dl>
                    <dt>Map</dt>
                    <dd>{this.props.data.MapId}</dd>
                </dl>
            </div>
        );
    }
});

var MatchList = React.createClass({
    getInitialState: function () {
        return { data: [] }
    },
    render: function () {
        var matchNodes = this.props.data.map(function (match) {
            return (
                <Match data={match} />
            );
        });

        return (
            <div className="matchList">
                {matchNodes}
            </div>
        );
    }
});

var MatchBox = React.createClass({
    getInitialState: function () {
        return { data: [], token: '', player: '' };
    },
    handleTokenUpdate: function (token, player) {
        this.setState({ token: token, player: player});

        if (!token || !player) {
            return;
        }

        getMatches(player, token).then(function (result) {
            this.setState({ data: result.Results });
        }.bind(this));
    },
    render: function () {
        return (
            <div className="matchBox">
                <h2>Token</h2>
                <TokenForm onTokenUpdate={this.handleTokenUpdate} />
                <h2>Matches</h2>
                <MatchList data={this.state.data} />
            </div>
        );
    }
});

var TokenForm = React.createClass({
    getInitialState: function () {
        return { token: '', player: '' };
    },
    handleSubmit: function (e) {
        e.preventDefault();
        var token = this.state.token.trim(),
            player = this.state.player.trim();
        this.props.onTokenUpdate(token, player);
    },
    handleTokenChange: function (e) {
        this.setState({ token: e.target.value });
    },
    handlePlayerChange: function (e) {
        this.setState({ player: e.target.value });
    },
    render: function () {
        return (
            <form className="tokenForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Enter gamertag" value={this.state.player} onChange={this.handlePlayerChange} />
                <input type="text" placeholder="Enter token" value={this.state.token} onChange={this.handleTokenChange} />
                <button type="submit">Update</button>
            </form>
        );
    }
})

ReactDOM.render(
    <MatchBox />,
    document.getElementById('main')
);
