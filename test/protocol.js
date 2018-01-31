let should = require('should');
let Protocol = require('../');
let Package = Protocol.Package;
let Message = Protocol.Message;

describe('Pomelo protocol test', function() {
  describe('String encode and decode', function() {
    it('should be ok to encode and decode Chinese string', function() {
      let str = '你好, abc~~~';
      let buf = Protocol.strencode(str);
      should.exist(buf);
      str.should.equal(Protocol.strdecode(buf));
    });
  });

  describe('Package encode and decode', function() {
    it('should keep the same data after encoding and decoding', function() {
      let msg = 'hello world~';
      let buf = Package.encode(Package.TYPE_DATA, Protocol.strencode(msg));
      should.exist(buf);
      let res = Package.decode(buf);
      should.exist(res);
      Package.TYPE_DATA.should.equal(res.type);
      should.exist(res.body);
      msg.should.equal(Protocol.strdecode(res.body));
    });

    it('should ok when encoding and decoding package without body', function() {
      let buf = Package.encode(Package.TYPE_HANDSHAKE);
      should.exist(buf);
      let res = Package.decode(buf);
      should.exist(res);
      Package.TYPE_HANDSHAKE.should.equal(res.type);
      should.not.exist(res.body);
    });
  });

  describe('Message encode and decode', function() {
    it('should be ok for encoding and decoding request', function() {
      let id = 128;
      let compress = 0;
      let route = 'connector.entryHandler.entry';
      let msg = 'hello world~';
      let buf = Message.encode(id, Message.TYPE_REQUEST, compress,
                               route, Protocol.strencode(msg));
      should.exist(buf);
      let res = Message.decode(buf);
      should.exist(res);
      id.should.equal(res.id);
      Message.TYPE_REQUEST.should.equal(res.type);
      compress.should.equal(res.compressRoute);
      route.should.equal(res.route);
      should.exist(res.body);
      msg.should.equal(Protocol.strdecode(res.body));
    });

    it('should be ok for encoding and decoding empty route', function() {
      let id = 256;
      let compress = 0;
      let route = '';
      let msg = 'hello world~';
      let buf = Message.encode(id, Message.TYPE_REQUEST, compress,
                               route, Protocol.strencode(msg));
      should.exist(buf);
      let res = Message.decode(buf);
      should.exist(res);
      id.should.equal(res.id);
      Message.TYPE_REQUEST.should.equal(res.type);
      compress.should.equal(res.compressRoute);
      route.should.equal(res.route);
      should.exist(res.body);
      msg.should.equal(Protocol.strdecode(res.body));
    });

    it('should be ok for encoding and decoding null route', function() {
      let n = Math.floor(10000*Math.random());
      let id = 128 * n;
      let compress = 0;
      let route = null;
      let msg = 'hello world~';
      let buf = Message.encode(id, Message.TYPE_REQUEST, compress,
                               route, Protocol.strencode(msg));
      should.exist(buf);
      let res = Message.decode(buf);
      should.exist(res);
      id.should.equal(res.id);
      Message.TYPE_REQUEST.should.equal(res.type);
      compress.should.equal(res.compressRoute);
      res.route.should.equal('');
      should.exist(res.body);
      msg.should.equal(Protocol.strdecode(res.body));
    });

    it('should be ok for encoding and decoding compress route', function() {
      let id = 256;
      let compress = 1;
      let route = 3;
      let msg = 'hello world~';
      let buf = Message.encode(id, Message.TYPE_REQUEST, compress,
                               route, Protocol.strencode(msg));
      should.exist(buf);
      let res = Message.decode(buf);
      should.exist(res);

      id.should.equal(res.id);
      Message.TYPE_REQUEST.should.equal(res.type);
      compress.should.equal(res.compressRoute);
      route.should.equal(res.route);
      should.exist(res.body);
      msg.should.equal(Protocol.strdecode(res.body));
    });

    it('should be ok for encoding and decoding mutil-bytes id', function() {
      let id = Math.pow(2, 30);
      let compress = 1;
      let route = 3;
      let msg = 'hello world~';
      let buf = Message.encode(id, Message.TYPE_REQUEST, compress,
                               route, Protocol.strencode(msg));
      should.exist(buf);
      let res = Message.decode(buf);
      should.exist(res);
      id.should.equal(res.id);
      Message.TYPE_REQUEST.should.equal(res.type);
      compress.should.equal(res.compressRoute);

      route.should.equal(res.route);
      should.exist(res.body);
      msg.should.equal(Protocol.strdecode(res.body));
    });

    it('should be ok for encoding and decoding notify', function() {
      let compress = 0;
      let route = 'connector.entryHandler.entry';
      let msg = 'hello world~';
      let buf = Message.encode(0, Message.TYPE_NOTIFY, compress,
                               route, Protocol.strencode(msg));
      should.exist(buf);
      let res = Message.decode(buf);
      should.exist(res);
      res.id.should.equal(0);
      Message.TYPE_NOTIFY.should.equal(res.type);
      compress.should.equal(res.compressRoute);
      route.should.equal(res.route);
      should.exist(res.body);
      msg.should.equal(Protocol.strdecode(res.body));
    });

    it('should be ok for encoding and decoding response', function() {
      let id = 1;
      let compress = 0;
      let msg = 'hello world~';
      let buf = Message.encode(id, Message.TYPE_RESPONSE, compress,
                               null, Protocol.strencode(msg));
      should.exist(buf);
      let res = Message.decode(buf);
      should.exist(res);
      id.should.equal(res.id);
      Message.TYPE_RESPONSE.should.equal(res.type);
      compress.should.equal(res.compressRoute);
      should.not.exist(res.route);
      should.exist(res.body);
      msg.should.equal(Protocol.strdecode(res.body));
    });

    it('should be ok for encoding and decoding push', function() {
      let compress = 0;
      let route = 'connector.entryHandler.entry';
      let msg = 'hello world~';
      let buf = Message.encode(0, Message.TYPE_PUSH, compress,
                               route, Protocol.strencode(msg));
      should.exist(buf);
      let res = Message.decode(buf);
      should.exist(res);
      res.id.should.equal(0);
      Message.TYPE_PUSH.should.equal(res.type);
      compress.should.equal(res.compressRoute);
      route.should.equal(res.route);
      should.exist(res.body);
      msg.should.equal(Protocol.strdecode(res.body));
    });

  });
});
